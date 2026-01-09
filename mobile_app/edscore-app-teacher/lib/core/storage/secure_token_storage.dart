import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureTokenStorage {
  static const _accessTokenKey = 'accessToken';
  static const _refreshTokenKey = 'refreshToken';
  static const _accessTokenExpiryKey = 'accessTokenExpiry';
  static const _refreshTokenExpiryKey = 'refreshTokenExpiry';

  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  /// Save tokens with optional expiry (in seconds)
  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
    int accessTokenExpirySeconds = 900, // default 15 minutes
    int refreshTokenExpirySeconds = 604800, // default 7 days
  }) async {
    final now = DateTime.now();

    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(
        key: _accessTokenExpiryKey,
        value: now.add(Duration(seconds: accessTokenExpirySeconds)).toIso8601String());

    await _storage.write(key: _refreshTokenKey, value: refreshToken);
    await _storage.write(
        key: _refreshTokenExpiryKey,
        value: now.add(Duration(seconds: refreshTokenExpirySeconds)).toIso8601String());
  }

  /// Check if token is expired
  static Future<bool> _isTokenExpired(String expiryKey) async {
    final expiryString = await _storage.read(key: expiryKey);
    if (expiryString == null) return true;

    final expiryTime = DateTime.tryParse(expiryString);
    return expiryTime == null || DateTime.now().isAfter(expiryTime);
  }

  /// Get access token if not expired, otherwise return null
  static Future<String?> getAccessToken() async {
    if (await _isTokenExpired(_accessTokenExpiryKey)) return null;
    return await _storage.read(key: _accessTokenKey);
  }

  /// Get refresh token if not expired, otherwise return null
  static Future<String?> getRefreshToken() async {
    if (await _isTokenExpired(_refreshTokenExpiryKey)) return null;
    return await _storage.read(key: _refreshTokenKey);
  }

  /// Clear all tokens
  static Future<void> clear() async {
    await _storage.deleteAll();
  }
}
