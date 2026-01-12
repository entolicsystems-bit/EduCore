import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureTokenStorage {
  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';
  static const _roleKey = 'user_role';
  static const _emailKey = 'user_email';
  static const _expiryKey = 'token_expiry';

  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  // Save tokens
  static Future<void> saveTokens(String accessToken, String refreshToken) async {
    await Future.wait([
      _storage.write(key: _accessTokenKey, value: accessToken),
      _storage.write(key: _refreshTokenKey, value: refreshToken),
    ]);
  }

  // Get access token
  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }

  // Get refresh token
  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  // Save user info
  static Future<void> saveUserInfo({
    required String email,
    required String role,
  }) async {
    await Future.wait([
      _storage.write(key: _emailKey, value: email),
      _storage.write(key: _roleKey, value: role),
    ]);
  }

  // Get user role
  static Future<String?> getRole() async {
    return await _storage.read(key: _roleKey);
  }

  // Get user email
  static Future<String?> getEmail() async {
    return await _storage.read(key: _emailKey);
  }

  // Save token expiry
  static Future<void> saveTokenExpiry(DateTime expiryTime) async {
    await _storage.write(
      key: _expiryKey,
      value: expiryTime.toIso8601String(),
    );
  }

  // Check if token is expired
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

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final accessToken = await getAccessToken();
    final refreshToken = await getRefreshToken();

    if (accessToken == null || refreshToken == null) return false;

    return !(await isTokenExpired());
  }

  // Clear all data (logout)
  static Future<void> clear() async {
    await _storage.deleteAll();
  }
}