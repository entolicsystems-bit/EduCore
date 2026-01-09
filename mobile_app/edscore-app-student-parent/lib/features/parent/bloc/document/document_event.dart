abstract class DocumentEvent {}

class PickBirthEvent extends DocumentEvent {}

class PickMedicalEvent extends DocumentEvent {}

class PickMarksheetEvent extends DocumentEvent {}

class DownloadDocumentEvent extends DocumentEvent {
  final String url;
  final String fileName;

  DownloadDocumentEvent({required this.url, required this.fileName});
}
//