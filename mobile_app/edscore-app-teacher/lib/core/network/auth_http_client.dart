import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_token_storage.dart';

class AuthHttpClient {
  static const String baseUrl = "http://3.7.212.22:3000/v1";

  Future<http.Response> get(String endpoint) async {
    final token = await SecureTokenStorage.getAccessToken();

    final response = await http.get(
      Uri.parse(baseUrl + endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        final newToken = await SecureTokenStorage.getAccessToken();
        return await http.get(
          Uri.parse(baseUrl + endpoint),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $newToken',
          },
        );
      }
    }
    return response;
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final token = await SecureTokenStorage.getAccessToken();

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
        final newToken = await SecureTokenStorage.getAccessToken();
        return await http.post(
          Uri.parse(baseUrl + endpoint),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $newToken',
          },
          body: jsonEncode(body),
        );
      }
    }

    return response;
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await SecureTokenStorage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await http.post(
        Uri.parse(baseUrl + "/auth/refresh"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "refreshToken": refreshToken
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);

        await SecureTokenStorage.saveTokens(
          data['accessToken'],
          data['refreshToken'],
        );
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }
}
