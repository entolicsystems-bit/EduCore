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

  // Student endpoints
  static const String studentProfile = '/v1/student/profile';
  static const String studentLeads = '/v1/leads';

  // Parent endpoints
  static const String parentDashboard = '/v1/parent/dashboard';

  // Helper to build full URL
  static String getUrl(String endpoint) {
    return '$baseUrl$endpoint';
  }
}