import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_token_storage.dart';

class AuthHttpClient {
  static const String baseUrl = "http://3.7.212.22:3000/v1";

  bool _isRefreshing = false;

  // ================= GET =================
  Future<http.Response> get(String endpoint) async {
    String? token = await SecureTokenStorage.getAccessToken();
    final expired = await SecureTokenStorage.isTokenExpired();

    if (token == null || expired) {
      final refreshed = await _refreshToken();
      if (!refreshed) {
        throw Exception("Session expired. Please login again.");
      }
      token = await SecureTokenStorage.getAccessToken();
    }

    return http.get(
      Uri.parse(baseUrl + endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }

  // ================= POST =================
  Future<http.Response> post(
      String endpoint,
      Map<String, dynamic> body,
      ) async {
    String? token = await SecureTokenStorage.getAccessToken();
    final expired = await SecureTokenStorage.isTokenExpired();

    if (token == null || expired) {
      final refreshed = await _refreshToken();
      if (!refreshed) {
        throw Exception("Session expired. Please login again.");
      }
      token = await SecureTokenStorage.getAccessToken();
    }

    return http.post(
      Uri.parse(baseUrl + endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
  }

  // ================= REFRESH TOKEN =================
  Future<bool> _refreshToken() async {
    if (_isRefreshing) return false;
    _isRefreshing = true;

    try {
      final refreshToken = await SecureTokenStorage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await http.post(
        Uri.parse("$baseUrl/auth/refresh"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"refreshToken": refreshToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        await SecureTokenStorage.saveTokens(
          data['accessToken'],
          data['refreshToken'],
          expirySeconds: data['expiresIn'] ?? 900,
        );

        return true;
      }

      return false;
    } catch (e) {
      print("Refresh token error: $e");
      return false;
    } finally {
      _isRefreshing = false;
    }
  }
}
