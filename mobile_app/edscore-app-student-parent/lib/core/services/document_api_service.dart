import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class DocumentApiService {
  final String baseUrl = 'http://3.7.212.22:3000/v1';
  final String token; // JWT token

  DocumentApiService({required this.token});

  /// Step 1: Import document to get upload URL
  Future<DocumentImportResponse> importDocument({
    required String fileName,
    required String fileType,
    required int fileSize,
    required String applicationId,
    required String documentType,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/documents/upload'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'fileName': fileName,
          'file_type': fileType,
          'fileSize': fileSize,
          'application_id': applicationId,
          'document_type': documentType,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return DocumentImportResponse.fromJson(
          jsonDecode(response.body),
        );
      } else {
        throw Exception(
          'Upload failed: ${response.statusCode} ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  /// Step 2: Upload file to AWS S3 using the upload URL
  Future<bool> uploadToS3({
    required String uploadUrl,
    required File file,
    required String fileType,
  }) async {
    try {
      final bytes = await file.readAsBytes();

      final response = await http.put(
        Uri.parse(uploadUrl),
        body: bytes,
        headers: {
          'Content-Type': fileType,
        },
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        throw Exception(
          'Upload failed with status: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Failed to upload to S3: $e');
    }
  }

  /// Complete upload flow: Import + Upload to S3
  Future<String> uploadDocument({
    required File file,
    required String fileName,
    required String fileType,
    required String applicationId,
    required String documentType,
  }) async {
    try {
      final fileSize = await file.length();

      final importResponse = await importDocument(
        fileName: fileName,
        fileType: fileType,
        fileSize: fileSize,
        applicationId: applicationId,
        documentType: documentType,
      );

      await uploadToS3(
        uploadUrl: importResponse.uploadUrl,
        file: file,
        fileType: fileType,
      );

      return importResponse.fileKey;
    } catch (e) {
      throw Exception('Upload process failed: $e');
    }
  }
}

/// Response model for document import
class DocumentImportResponse {
  final String uploadUrl;
  final String fileKey;
  final int expiresIn;
  final int maxSize;
  final List<String> allowedTypes;
  final String documentType;

  DocumentImportResponse({
    required this.uploadUrl,
    required this.fileKey,
    required this.expiresIn,
    required this.maxSize,
    required this.allowedTypes,
    required this.documentType,
  });

  factory DocumentImportResponse.fromJson(Map<String, dynamic> json) {
    return DocumentImportResponse(
      uploadUrl: json['upload_url'],
      fileKey: json['file_key'],
      expiresIn: json['expires_in'],
      maxSize: json['max_size'],
      allowedTypes: List<String>.from(json['allowed_types']),
      documentType: json['document_type'],
    );
  }
}
