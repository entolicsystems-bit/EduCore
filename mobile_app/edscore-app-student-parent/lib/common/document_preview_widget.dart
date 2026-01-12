import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:student/core/theme/app_colours.dart';
import '../features/parent/data/models/document_type.dart';

class DocumentPreviewWidget extends StatefulWidget {
  final DocumentType type;
  final String statusText;
  final Color statusColor;
  final String uploadDate;
  final VoidCallback onDownload;
  final VoidCallback onClose;
  final bool showDownloadButton;

  const DocumentPreviewWidget({
    super.key,
    required this.type,
    required this.statusText,
    required this.statusColor,
    required this.uploadDate,
    required this.onDownload,
    required this.onClose,
    this.showDownloadButton = true,
  });

  @override
  State<DocumentPreviewWidget> createState() => _DocumentPreviewWidgetState();
}

class _DocumentPreviewWidgetState extends State<DocumentPreviewWidget> {
  late String fileName;

  @override
  void initState() {
    super.initState();

    switch (widget.type) {
      case DocumentType.birth:
        fileName = "Birth Certificate";
        break;
      case DocumentType.medical:
        fileName = "Medical Certificate";
        break;
      case DocumentType.marksheet:
        fileName = "Previous Marksheet";
        break;
    }
  }

  String get title {
    switch (widget.type) {
      case DocumentType.birth:
        return "Birth Certificate";
      case DocumentType.medical:
        return "Medical Certificate";
      case DocumentType.marksheet:
        return "Previous Marksheet";
    }
  }

  Future<void> _pickFile() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'png'],
      );

      if (result != null && result.files.isNotEmpty) {
        setState(() {
          fileName = result.files.first.name; // update fileName dynamically
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Selected: ${result.files.first.name}")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("File pick error: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(onPressed: widget.onClose, icon: const Icon(Icons.close))
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 30),

//
            Center(
              child: Container(
                height: 500,
                width: 350,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: GestureDetector(
                  onTap: _pickFile,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.description_outlined,
                        size: 100,
                        color: Colors.blue,
                      ),
                      const SizedBox(height: 10),
                      Flexible(
                        child: Text(
                          fileName,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        "pdf",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),


            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Status",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Flexible(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: widget.statusColor.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        widget.statusText,
                        style: TextStyle(
                          fontSize: 12,
                          color: widget.statusColor,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Upload Date",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Flexible(
                    child: Text(
                      widget.uploadDate,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black,
                      ),
                      textAlign: TextAlign.right,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 25),


            if (widget.showDownloadButton)
              SizedBox(
                width: 320,
                height: 48,
                child: ElevatedButton(
                  onPressed: widget.onDownload,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    "Download Document",
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                ),
              ),

            const SizedBox(height: 12),


            SizedBox(
              width: 320,
              height: 48,
              child: ElevatedButton(
                onPressed: widget.onClose,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Close",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
