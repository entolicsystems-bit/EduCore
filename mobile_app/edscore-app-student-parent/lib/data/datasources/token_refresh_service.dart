import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

/// Service to handle token refresh for both Student and Parent
class TokenRefreshService {
  static final TokenRefreshService _instance = TokenRefreshService._internal();
  factory TokenRefreshService() => _instance;
  TokenRefreshService._internal();

  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  /// Check if student token is expired
  Future<bool> isStudentTokenExpired() async {
    final expiryString = await _storage.read(key: 'token_expiry');
    if (expiryString == null) return true;

    final expiryTime = DateTime.parse(expiryString);
    return DateTime.now().isAfter(expiryTime);
  }

  /// Check if parent token is expired
  Future<bool> isParentTokenExpired() async {
    final expiryString = await _storage.read(key: 'parent_token_expiry');
    if (expiryString == null) return true;

    final expiryTime = DateTime.parse(expiryString);
    return DateTime.now().isAfter(expiryTime);
  }

  /// Refresh student token
  Future<Map<String, String>?> refreshStudentToken() async {
    try {
      final refreshToken = await _storage.read(key: 'refresh_token');

      if (refreshToken == null) {
        throw Exception('No refresh token found');
      }

      final response = await http.post(
        Uri.parse('http://3.7.212.22:3000/v1/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Save new tokens
        await _storage.write(key: 'access_token', value: data['accessToken']);
        await _storage.write(key: 'refresh_token', value: data['refreshToken']);

        // Update expiry time
        final expiryTime = DateTime.now().add(const Duration(minutes: 15));
        await _storage.write(key: 'token_expiry', value: expiryTime.toIso8601String());

        return {
          'accessToken': data['accessToken'],
          'refreshToken': data['refreshToken'],
        };
      } else {
        // If refresh fails, clear tokens
        await _storage.delete(key: 'access_token');
        await _storage.delete(key: 'refresh_token');
        await _storage.delete(key: 'token_expiry');
        return null;
      }
    } catch (e) {
      print('Student token refresh error: $e');
      return null;
    }
  }

  /// Refresh parent token
  Future<Map<String, String>?> refreshParentToken() async {
    try {
      final refreshToken = await _storage.read(key: 'parent_refresh_token');

      if (refreshToken == null) {
        throw Exception('No refresh token found');
      }

      final response = await http.post(
        Uri.parse('http://3.7.212.22:3000/v1/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Save new tokens
        await _storage.write(key: 'parent_access_token', value: data['accessToken']);
        await _storage.write(key: 'parent_refresh_token', value: data['refreshToken']);

        // Update expiry time
        final expiryTime = DateTime.now().add(const Duration(minutes: 15));
        await _storage.write(key: 'parent_token_expiry', value: expiryTime.toIso8601String());

        return {
          'accessToken': data['accessToken'],
          'refreshToken': data['refreshToken'],
        };
      } else {
        // If refresh fails, clear tokens
        await _storage.delete(key: 'parent_access_token');
        await _storage.delete(key: 'parent_refresh_token');
        await _storage.delete(key: 'parent_token_expiry');
        return null;
      }
    } catch (e) {
      print('Parent token refresh error: $e');
      return null;
    }
  }

  /// Get valid student access token (auto-refresh if expired)
  Future<String?> getValidStudentAccessToken() async {
    final isExpired = await isStudentTokenExpired();

    if (isExpired) {
      final tokens = await refreshStudentToken();
      return tokens?['accessToken'];
    }

    return await _storage.read(key: 'access_token');
  }

  /// Get valid parent access token (auto-refresh if expired)
  Future<String?> getValidParentAccessToken() async {
    final isExpired = await isParentTokenExpired();

    if (isExpired) {
      final tokens = await refreshParentToken();
      return tokens?['accessToken'];
    }

    return await _storage.read(key: 'parent_access_token');
  }

  /// Get user type
  Future<String?> getUserType() async {
    return await _storage.read(key: 'user_type');
  }
}