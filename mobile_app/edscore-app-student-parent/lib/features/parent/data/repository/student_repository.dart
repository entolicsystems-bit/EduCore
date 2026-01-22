import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/student_profile_model.dart';

class StudentRepository {
  final String baseUrl;
  final Duration timeout;

  StudentRepository(
      this.baseUrl, {
        this.timeout = const Duration(seconds: 30),
      });

  Future<StudentProfile> fetchStudentProfile({
    required String studentId,
    required String token,
  }) async {
    try {
      final response = await http
          .get(
        Uri.parse('$baseUrl/students/$studentId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      )
          .timeout(timeout);

      // Handle different status codes
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return StudentProfile.fromJson(data);
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        throw UnauthorizedException('Unauthorized access');
      } else if (response.statusCode == 404) {
        throw NotFoundException('Student not found');
      } else if (response.statusCode >= 500) {
        throw ServerException('Server error. Please try again later.');
      } else {
        throw ApiException(
          'Failed to load student profile (${response.statusCode})',
        );
      }
    } on SocketException {
      throw NetworkException('No internet connection');
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } on FormatException {
      throw DataParseException('Invalid data format received');
    } catch (e) {
      if (e is RepositoryException) {
        rethrow;
      }
      throw ApiException('An unexpected error occurred: ${e.toString()}');
    }
  }
}

// Custom Exceptions
abstract class RepositoryException implements Exception {
  final String message;
  RepositoryException(this.message);

  @override
  String toString() => message;
}

class NetworkException extends RepositoryException {
  NetworkException(super.message);
}

class UnauthorizedException extends RepositoryException {
  UnauthorizedException(super.message);
}

class NotFoundException extends RepositoryException {
  NotFoundException(super.message);
}

class ServerException extends RepositoryException {
  ServerException(super.message);
}

class ApiException extends RepositoryException {
  ApiException(super.message);
}

class DataParseException extends RepositoryException {
  DataParseException(super.message);
}