import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import '../../core/constants/api_constants.dart';
import '../../core/errors/auth_exception.dart';

class TokenRefreshService {
  static final TokenRefreshService _instance =
  TokenRefreshService._internal();

  factory TokenRefreshService() => _instance;
  TokenRefreshService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  Future<bool> _isTokenExpired(String key) async {
    final expiry = await _storage.read(key: key);
    if (expiry == null) return true;
    return DateTime.now().isAfter(DateTime.parse(expiry));
  }

  // ================= STUDENT =================

  Future<String?> getValidStudentAccessToken() async {
    final expired = await _isTokenExpired('student_token_expiry');
    if (expired) {
      final tokens = await _refreshStudentToken();
      return tokens?['accessToken'];
    }
    return _storage.read(key: 'student_access_token');
  }

  Future<Map<String, String>?> _refreshStudentToken() async {
    final refreshToken =
    await _storage.read(key: 'student_refresh_token');

    if (refreshToken == null) {
      throw AuthException('Session expired. Please login again.');
    }

    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.refreshToken}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode != 200) {
      await _clearStudent();
      return null;
    }

    final data = jsonDecode(response.body);
    final expiry = DateTime.now()
    //------------------- expiration handling without hardcoded timing -------------------
        .add(Duration(seconds: data['expiresIn']));

    await _storage.write(
        key: 'student_access_token', value: data['accessToken']);
    await _storage.write(
        key: 'student_refresh_token', value: data['refreshToken']);
    await _storage.write(
        key: 'student_token_expiry', value: expiry.toIso8601String());

    return {
      'accessToken': data['accessToken'],
      'refreshToken': data['refreshToken'],
    };
  }

  Future<void> _clearStudent() async {
    await _storage.delete(key: 'student_access_token');
    await _storage.delete(key: 'student_refresh_token');
    await _storage.delete(key: 'student_token_expiry');
  }

  // ================= PARENT =================

  Future<String?> getValidParentAccessToken() async {
    final expired = await _isTokenExpired('parent_token_expiry');
    if (expired) {
      final tokens = await _refreshParentToken();
      return tokens?['accessToken'];
    }
    return _storage.read(key: 'parent_access_token');
  }

  Future<Map<String, String>?> _refreshParentToken() async {
    final refreshToken =
    await _storage.read(key: 'parent_refresh_token');

    if (refreshToken == null) {
      throw AuthException('Session expired. Please login again.');
    }

    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.refreshToken}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode != 200) {
      await _clearParent();
      return null;
    }

    final data = jsonDecode(response.body);
    final expiry = DateTime.now()
        .add(Duration(seconds: data['expiresIn']));

    await _storage.write(
        key: 'parent_access_token', value: data['accessToken']);
    await _storage.write(
        key: 'parent_refresh_token', value: data['refreshToken']);
    await _storage.write(
        key: 'parent_token_expiry', value: expiry.toIso8601String());

    return {
      'accessToken': data['accessToken'],
      'refreshToken': data['refreshToken'],
    };
  }

  Future<void> _clearParent() async {
    await _storage.delete(key: 'parent_access_token');
    await _storage.delete(key: 'parent_refresh_token');
    await _storage.delete(key: 'parent_token_expiry');
  }
}
