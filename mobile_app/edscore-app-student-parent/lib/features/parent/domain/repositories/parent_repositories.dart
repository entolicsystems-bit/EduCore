import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:student/data/services/token_refresh_service.dart';

import '../entities/parent_home.dart';
import '../entities/student_profile.dart';
import '../entities/document.dart';

class ParentRepository {
  final TokenRefreshService _tokenService = TokenRefreshService();

  final String baseUrl = 'http://3.7.212.22:3000/v1';

  // ================= PARENT HOME =================

  Future<ParentHomeData> getParentHome() async {
    try {
      final accessToken =
      await _tokenService.getValidParentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/parent/dashboard'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        return _parseParentHomeData(jsonDecode(response.body));
      }

      throw Exception('Failed to load parent home data');
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }

  // ================= STUDENT PROFILE =================

  Future<StudentProfile> getStudentProfile(String studentId) async {
    try {
      final accessToken =
      await _tokenService.getValidParentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/parent/student/$studentId/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        return _parseStudentProfile(jsonDecode(response.body));
      }

      throw Exception('Failed to load student profile');
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }

  // ================= STUDENT DOCUMENTS =================

  Future<DocumentSummary> getStudentDocuments(String studentId) async {
    try {
      final accessToken =
      await _tokenService.getValidParentAccessToken();

      if (accessToken == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/parent/student/$studentId/documents'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        return _parseDocumentSummary(jsonDecode(response.body));
      }

      throw Exception('Failed to load documents');
    } catch (e) {
      throw Exception('Error: ${e.toString()}');
    }
  }

  // ================= PARSERS (UNCHANGED) =================

  ParentHomeData _parseParentHomeData(Map<String, dynamic> data) {
    final List<StudentInfo> students = [];

    if (data['students'] != null) {
      for (var student in data['students']) {
        students.add(
          StudentInfo(
            id: student['id'] ?? '',
            name: student['name'] ?? 'Student',
            grade: student['grade'] ?? 'Grade 10-A',
            enrollmentStatus:
            student['enrollmentStatus'] ?? 'Enrolled',
            profileImage: student['profileImage'],
          ),
        );
      }
    }

    return ParentHomeData(
      parentName: data['parentName'] ?? 'Parent',
      students: students,
    );
  }

  StudentProfile _parseStudentProfile(Map<String, dynamic> data) {
    PersonalInformation? personalInfo;
    GuardianInformation? guardianInfo;
    AcademicSummary? academicSummary;

    if (data['personalInformation'] != null) {
      final info = data['personalInformation'];
      personalInfo = PersonalInformation(
        dateOfBirth: info['dateOfBirth'] ?? '',
        gender: info['gender'] ?? '',
        bloodGroup: info['bloodGroup'] ?? '',
        address: info['address'] ?? '',
        phone: info['phone'] ?? '',
        email: info['email'] ?? '',
      );
    }

    if (data['guardianInformation'] != null) {
      final info = data['guardianInformation'];
      guardianInfo = GuardianInformation(
        fatherName: info['fatherName'] ?? '',
        fatherOccupation: info['fatherOccupation'] ?? '',
        fatherPhone: info['fatherPhone'] ?? '',
        motherName: info['motherName'] ?? '',
        motherOccupation: info['motherOccupation'] ?? '',
        motherPhone: info['motherPhone'] ?? '',
      );
    }

    if (data['academicSummary'] != null) {
      final summary = data['academicSummary'];
      academicSummary = AcademicSummary(
        attendance: (summary['attendance'] ?? 0).toDouble(),
        cgpa: (summary['cgpa'] ?? 0).toDouble(),
        totalSubjects: summary['totalSubjects'] ?? 0,
        academicYear: summary['academicYear'] ?? '',
      );
    }

    return StudentProfile(
      id: data['id'] ?? '',
      name: data['name'] ?? 'Student',
      grade: data['grade'] ?? 'Grade 10-A',
      enrollmentStatus:
      data['enrollmentStatus'] ?? 'Enrolled',
      profileImage: data['profileImage'],
      personalInfo: personalInfo,
      guardianInfo: guardianInfo,
      academicSummary: academicSummary,
    );
  }

  DocumentSummary _parseDocumentSummary(Map<String, dynamic> data) {
    final List<StudentDocument> documents = [];

    if (data['documents'] != null) {
      for (var doc in data['documents']) {
        documents.add(
          StudentDocument(
            id: doc['id'] ?? '',
            name: doc['name'] ?? 'Document',
            uploadDate: doc['uploadDate'] ?? '',
            status: doc['status'] ?? 'pending',
            fileUrl: doc['fileUrl'],
          ),
        );
      }
    }

    return DocumentSummary(
      totalDocuments:
      data['totalDocuments'] ?? documents.length,
      verifiedDocuments: data['verifiedDocuments'] ?? 0,
      uploadedDocuments: data['uploadedDocuments'] ?? 0,
      pendingDocuments: data['pendingDocuments'] ?? 0,
      documents: documents,
    );
  }
}
