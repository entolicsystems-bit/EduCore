import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../core/constants/api_constants.dart';
import '../../core/errors/auth_exception.dart';
import 'token_refresh_service.dart';

class StudentApiService {
  final TokenRefreshService _tokenService = TokenRefreshService();

  Future<Map<String, dynamic>> getStudentProfile() async {
    final token = await _tokenService.getValidStudentAccessToken();

    if (token == null) {
      throw AuthException('Session expired. Please login again.');
    }

    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.studentProfile}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    throw AuthException('Unauthorized. Please login again.');
  }

  Future<List<dynamic>> getAllLeads() async {
    final token = await _tokenService.getValidStudentAccessToken();

    if (token == null) {
      throw AuthException('Session expired. Please login again.');
    }

    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.studentLeads}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    throw Exception('Failed to load leads');
  }
}
