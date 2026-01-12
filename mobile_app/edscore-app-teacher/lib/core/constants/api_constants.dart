class ApiConstants {
  // Environment-based base URL
  static const String baseUrl = String.fromEnvironment(
    'BASE_URL',
    defaultValue: 'http://3.7.212.22:3000',
  );

  // Auth endpoints
  static const String login = '/v1/auth/login';
  static const String logout = '/v1/auth/logout';
  static const String refreshToken = '/v1/auth/refresh';

  // Teacher endpoints
  static const String teacherProfile = '/v1/teacher/profile';
  static const String attendance = '/v1/attendance';

  // Helper to build full URL
  static String getUrl(String endpoint) {
    return '$baseUrl$endpoint';
  }
}