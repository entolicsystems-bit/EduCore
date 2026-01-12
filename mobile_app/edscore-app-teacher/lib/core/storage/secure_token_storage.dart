import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureTokenStorage {
  static const _accessTokenKey = 'accessToken';
  static const _refreshTokenKey = 'refreshToken';
  static const _roleKey = 'userRole';
  static const _expiryKey = 'tokenExpiry';

  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  /// Save access and refresh tokens with expiry
  static Future<void> saveTokens(
      String accessToken,
      String refreshToken, {
        int expirySeconds = 900, // Default 15 minutes
      }) async {
    final expiryTime = DateTime.now().add(Duration(seconds: expirySeconds));

    await Future.wait([
      _storage.write(key: _accessTokenKey, value: accessToken),
      _storage.write(key: _refreshTokenKey, value: refreshToken),
      _storage.write(key: _expiryKey, value: expiryTime.toIso8601String()),
    ]);
  }

  /// Get access token
  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }

  /// Get refresh token
  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  /// Save user role
  static Future<void> saveRole(String role) async {
    await _storage.write(key: _roleKey, value: role);
  }

  /// Get user role
  static Future<String?> getRole() async {
    return await _storage.read(key: _roleKey);
  }

  /// Check if token is expired
  static Future<bool> isTokenExpired() async {
    final expiryString = await _storage.read(key: _expiryKey);

    if (expiryString == null) return true;

    try {
      final expiryTime = DateTime.parse(expiryString);
      return DateTime.now().isAfter(expiryTime);
    } catch (_) {
      return true;
    }
  }

  /// Check if user is logged in (with expiry check)
  static Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    if (token == null) return false;

    // Check if token is expired
    final expired = await isTokenExpired();
    return !expired;
  }

  /// Check if user is a teacher
  static Future<bool> isTeacher() async {
    final role = await getRole();
    return role?.toUpperCase() == 'TEACHER';
  }

  /// Clear all stored data (logout)
  static Future<void> clear() async {
    await _storage.deleteAll();
  }
}