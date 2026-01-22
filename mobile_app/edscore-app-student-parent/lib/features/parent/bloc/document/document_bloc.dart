// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:file_picker/file_picker.dart';
//
// import 'package:path_provider/path_provider.dart';
// import 'dart:io';
//
// import 'document_event.dart';
// import 'document_state.dart';
//
// class DocumentBloc extends Bloc<DocumentEvent, DocumentState> {
//   DocumentBloc() : super(DocumentState()) {
//     on<PickBirthEvent>(_pickBirth);
//     on<PickMedicalEvent>(_pickMedical);
//     on<PickMarksheetEvent>(_pickMarksheet);
//     on<DownloadDocumentEvent>(_downloadFile);
//   }
//
//   Future<void> _pickBirth(
//       PickBirthEvent event, Emitter<DocumentState> emit) async {
//     final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
//
//     if (result != null) {
//       emit(state.copyWith(
//         birthFileName: result.files.single.name,
//         birthStatus: "Verified",
//       ));
//     }
//   }
// //
//   Future<void> _pickMedical(
//       PickMedicalEvent event, Emitter<DocumentState> emit) async {
//     final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
//
//     if (result != null) {
//       emit(state.copyWith(
//         medicalFileName: result.files.single.name,
//         medicalStatus: "Verified",
//       ));
//     }
//   }
//
//   Future<void> _pickMarksheet(
//       PickMarksheetEvent event, Emitter<DocumentState> emit) async {
//     final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
//
//     if (result != null) {
//       emit(state.copyWith(
//         marksheetFileName: result.files.single.name,
//         marksheetStatus: "Verified",
//       ));
//     }
//   }
//
//   Future<void> _downloadFile(
//       DownloadDocumentEvent event, Emitter<DocumentState> emit) async {
//     try {
//       emit(state.copyWith(isDownloading: true));
//
//       final dir = await getApplicationDocumentsDirectory();
//       final savePath = "${dir.path}/${event.fileName}";
//
//       // await Dio().download(event.url, savePath);
//
//       emit(state.copyWith(isDownloading: false));
//     } catch (e) {
//       emit(state.copyWith(isDownloading: false));
//     }
//   }
// }

import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../data/models/document_model.dart';
import '../../../../core/services/document_api_service.dart';
import 'document_event.dart';
import 'document_state.dart';

class DocumentBloc extends Bloc<DocumentEvent, DocumentState> {
  List<DocumentModel> _documents = [];
  final DocumentApiService apiService;

  DocumentBloc({required this.apiService}) : super(DocumentInitial()) {
    on<LoadDocumentsEvent>(_onLoadDocuments);
    on<UploadDocumentEvent>(_onUploadDocument);
  }

  Future<void> _onLoadDocuments(
      LoadDocumentsEvent event, Emitter<DocumentState> emit) async {
    emit(DocumentLoading());

    await Future.delayed(const Duration(seconds: 1));

    _documents = [
      DocumentModel(
        name: "Birth Certificate",
        status: "verified",
        uploadDate: "25 Dec 2025",
      ),
      DocumentModel(
        name: "Medical Certificate",
        status: "uploaded",
        uploadDate: "25 Dec 2025",
      ),
      DocumentModel(
        name: "Previous Marksheet",
        status: "pending",
        uploadDate: "25 Dec 2025",
      ),
    ];

    emit(DocumentLoaded(_documents));
  }

  Future<void> _onUploadDocument(
      UploadDocumentEvent event, Emitter<DocumentState> emit) async {
    try {
      // Emit uploading state
      emit(DocumentUploading(index: event.index));

      // Get file info
      final file = File(event.filePath);
      final fileName = file.path.split('/').last;
      final fileType = _getFileType(fileName);

      // Upload document
      final fileKey = await apiService.uploadDocument(
        file: file,
        fileName: fileName,
        fileType: fileType,
        applicationId: event.applicationId,
        documentType: event.documentType,
      );

      // Update document status
      _documents[event.index] = DocumentModel(
        name: _documents[event.index].name,
        status: "uploaded",
        uploadDate: DateTime.now().toString().substring(0, 10),
      );

      emit(DocumentLoaded(List.from(_documents)));
      emit(DocumentUploadSuccess(
        message: "Document uploaded successfully",
        fileKey: fileKey,
      ));
    } catch (e) {
      emit(DocumentError(e.toString()));
      // Re-emit loaded state to keep UI intact
      emit(DocumentLoaded(List.from(_documents)));
    }
  }

  String _getFileType(String fileName) {
    final extension = fileName.split('.').last.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  }
}