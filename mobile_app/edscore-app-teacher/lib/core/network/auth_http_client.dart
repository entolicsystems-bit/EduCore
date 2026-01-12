import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_token_storage.dart';

class AuthHttpClient {
  static const String baseUrl = "http://3.7.212.22:3000/v1";

  Future<http.Response> get(String endpoint) async {
    String? token = await SecureTokenStorage.getAccessToken();

    // If access token is expired, try refreshing
    if (token == null) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        token = await SecureTokenStorage.getAccessToken();
      }
    }

    final response = await http.get(
      Uri.parse(baseUrl + endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    // If server still returns 401, try refreshing once more
    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        token = await SecureTokenStorage.getAccessToken();
        return await http.get(
          Uri.parse(baseUrl + endpoint),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
      }
    }

    return response;
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    String? token = await SecureTokenStorage.getAccessToken();

    // Refresh if token expired
    if (token == null) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        token = await SecureTokenStorage.getAccessToken();
      }
    }

    final response = await http.post(
      Uri.parse(baseUrl + endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        token = await SecureTokenStorage.getAccessToken();
        return await http.post(
          Uri.parse(baseUrl + endpoint),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: jsonEncode(body),
        );
      }
    }

    return response;
  }

  /// Refresh access token using refresh token
  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await SecureTokenStorage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await http.post(
        Uri.parse(baseUrl + "/auth/refresh"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"refreshToken": refreshToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Save new tokens with expiration (optional: 15 min for access, 7 days for refresh)
        await SecureTokenStorage.saveTokens(
          accessToken: data['accessToken'],
          refreshToken: data['refreshToken'],
          accessTokenExpirySeconds: data['expiresIn'] ?? 900, // 15 min default
        );

        return true;
      }

      return false;
    } catch (e) {
      print('Token refresh error: $e');
      return false;
    }
  }
}
