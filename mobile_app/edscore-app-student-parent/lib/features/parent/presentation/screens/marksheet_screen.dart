import 'package:flutter/material.dart';
import '../../../../common/document_preview_widget.dart';
import '../../data/models/document_type.dart';

class MarksheetScreen extends StatelessWidget {
  const MarksheetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DocumentPreviewWidget(
      type: DocumentType.marksheet,
      statusText: "Pending",
      statusColor: Colors.red,
      uploadDate: "27 Dec 2025",
      onDownload: () {
        // download marksheet
      },
      onClose: () {
        Navigator.pop(context);
      },
      showDownloadButton: false,
    );
  }
}
//