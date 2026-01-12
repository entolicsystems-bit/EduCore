// lib/features/parent/domain/entities/document.dart

class StudentDocument {
  final String id;
  final String name;
  final String uploadDate;
  final String status; // verified, uploaded, pending
  final String? fileUrl;

  StudentDocument({
    required this.id,
    required this.name,
    required this.uploadDate,
    required this.status,
    this.fileUrl,
  });
}

class DocumentSummary {
  final int totalDocuments;
  final int verifiedDocuments;
  final int uploadedDocuments;
  final int pendingDocuments;
  final List<StudentDocument> documents;

  DocumentSummary({
    required this.totalDocuments,
    required this.verifiedDocuments,
    required this.uploadedDocuments,
    required this.pendingDocuments,
    required this.documents,
  });
}