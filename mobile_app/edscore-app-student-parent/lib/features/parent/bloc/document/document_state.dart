// class DocumentState {
//   final String? birthFileName;
//   final String? medicalFileName;
//   final String? marksheetFileName;
//
//   final String birthStatus;
//   final String medicalStatus;
//   final String marksheetStatus;
//
//   final bool isDownloading;
//   DocumentState({
//     this.birthFileName,
//     this.medicalFileName,
//     this.marksheetFileName,
//     this.birthStatus = "Pending",
//     this.medicalStatus = "Pending",
//     this.marksheetStatus = "Pending",
//     this.isDownloading = false,
//   });
// //
//   DocumentState copyWith({
//     String? birthFileName,
//     String? medicalFileName,
//     String? marksheetFileName,
//     String? birthStatus,
//     String? medicalStatus,
//     String? marksheetStatus,
//     bool? isDownloading,
//   }) {
//     return DocumentState(
//       birthFileName: birthFileName ?? this.birthFileName,
//       medicalFileName: medicalFileName ?? this.medicalFileName,
//       marksheetFileName: marksheetFileName ?? this.marksheetFileName,
//       birthStatus: birthStatus ?? this.birthStatus,
//       medicalStatus: medicalStatus ?? this.medicalStatus,
//       marksheetStatus: marksheetStatus ?? this.marksheetStatus,
//       isDownloading: isDownloading ?? this.isDownloading,
//     );
//   }
// }



import '../../../../data/models/document_model.dart';

abstract class DocumentState {}

class DocumentInitial extends DocumentState {}

class DocumentLoading extends DocumentState {}

class DocumentLoaded extends DocumentState {
  final List<DocumentModel> documents;

  DocumentLoaded(this.documents);
}

class DocumentUploading extends DocumentState {
  final int index;

  DocumentUploading({required this.index});
}

class DocumentUploadSuccess extends DocumentState {
  final String message;
  final String fileKey;

  DocumentUploadSuccess({required this.message, required this.fileKey});
}

class DocumentError extends DocumentState {
  final String message;

  DocumentError(this.message);
}