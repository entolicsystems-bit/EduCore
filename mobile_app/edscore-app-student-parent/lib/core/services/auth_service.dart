import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  /// Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final accessToken = await _storage.read(key: 'access_token');
    return accessToken != null;
  }

  /// Get current user role (STUDENT or PARENT)
  static Future<String?> getUserRole() async {
    return await _storage.read(key: 'user_role');
  }

  /// Check if current user is a student
  static Future<bool> isStudent() async {
    final role = await getUserRole();
    return role?.toUpperCase() == 'STUDENT';
  }

  /// Check if current user is a parent
  static Future<bool> isParent() async {
    final role = await getUserRole();
    return role?.toUpperCase() == 'PARENT';
  }

  /// Get user email
  static Future<String?> getUserEmail() async {
    return await _storage.read(key: 'user_email');
  }

  /// Get access token
  static Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }

  /// Get refresh token
  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refresh_token');
  }

  /// Check if token is expired
  static Future<bool> isTokenExpired() async {
    final expiryString = await _storage.read(key: 'token_expiry');

    if (expiryString == null) return true;

    try {
      final expiryTime = DateTime.parse(expiryString);
      return DateTime.now().isAfter(expiryTime);
    } catch (_) {
      return true;
    }
  }

  /// Clear all auth data (logout)
  static Future<void> clearAuthData() async {
    await _storage.deleteAll();
  }
}

// Usage Example:
//
// Check if user is logged in:
// bool loggedIn = await AuthService.isLoggedIn();
//
// Get user role:
// String? role = await AuthService.getUserRole();
//
// Check specific role:
// bool isStudent = await AuthService.isStudent();
// bool isParent = await AuthService.isParent();