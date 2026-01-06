import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../data/datasources/token_refresh_service.dart';

/// Example service showing how to use token refresh for API calls
class StudentApiService {
  final TokenRefreshService _tokenService = TokenRefreshService();

  /// Get student profile with automatic token refresh
  Future<Map<String, dynamic>> getStudentProfile() async {
    try {
      // Get valid access token (auto-refreshes if expired)
      final accessToken = await _tokenService.getValidStudentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated. Please login again.');
      }

      final response = await http.get(
        Uri.parse('http://3.7.212.22:3000/v1/student/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      // If 401, try refresh once more
      if (response.statusCode == 401) {
        final newToken = (await _tokenService.refreshStudentToken())?['accessToken'];

        if (newToken == null) {
          throw Exception('Session expired. Please login again.');
        }

        // Retry with new token
        final retryResponse = await http.get(
          Uri.parse('http://3.7.212.22:3000/v1/student/profile'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $newToken',
          },
        );

        if (retryResponse.statusCode == 200) {
          return jsonDecode(retryResponse.body);
        } else {
          throw Exception('Failed to fetch profile');
        }
      }

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch profile');
      }
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }

  /// Get all leads (example from API docs)
  Future<List<dynamic>> getAllLeads() async {
    try {
      final accessToken = await _tokenService.getValidStudentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('http://3.7.212.22:3000/v1/leads'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 401) {
        // Auto retry with refreshed token
        final newToken = (await _tokenService.refreshStudentToken())?['accessToken'];
        if (newToken != null) {
          final retryResponse = await http.get(
            Uri.parse('http://3.7.212.22:3000/v1/leads'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $newToken',
            },
          );
          if (retryResponse.statusCode == 200) {
            return jsonDecode(retryResponse.body);
          }
        }
      }

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch leads');
      }
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }
}

/// Parent API Service example
class ParentApiService {
  final TokenRefreshService _tokenService = TokenRefreshService();

  Future<Map<String, dynamic>> getParentDashboard() async {
    try {
      final accessToken = await _tokenService.getValidParentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated. Please login again.');
      }

      final response = await http.get(
        Uri.parse('http://3.7.212.22:3000/v1/parent/dashboard'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 401) {
        final newToken = (await _tokenService.refreshParentToken())?['accessToken'];

        if (newToken == null) {
          throw Exception('Session expired. Please login again.');
        }

        final retryResponse = await http.get(
          Uri.parse('http://3.7.212.22:3000/v1/parent/dashboard'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $newToken',
          },
        );

        if (retryResponse.statusCode == 200) {
          return jsonDecode(retryResponse.body);
        }
      }

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch dashboard');
      }
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }
}