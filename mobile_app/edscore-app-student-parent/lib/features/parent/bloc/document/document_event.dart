// abstract class DocumentEvent {}
//
// class PickBirthEvent extends DocumentEvent {}
//
// class PickMedicalEvent extends DocumentEvent {}
//
// class PickMarksheetEvent extends DocumentEvent {}
//
// class DownloadDocumentEvent extends DocumentEvent {
//   final String url;
//   final String fileName;
//
//   DownloadDocumentEvent({required this.url, required this.fileName});
// }
// //

abstract class DocumentEvent {}

class LoadDocumentsEvent extends DocumentEvent {}

class UploadDocumentEvent extends DocumentEvent {
  final int index;
  final String filePath;
  final String applicationId;
  final String documentType; // ID_PROOF, MARKSHEET, BIRTH_CERTIFICATE, etc.

  UploadDocumentEvent({
    required this.index,
    required this.filePath,
    required this.applicationId,
    required this.documentType,
  });
}