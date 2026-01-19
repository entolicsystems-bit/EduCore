import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:student/core/theme/app_colours.dart';

import '../../../../core/utils/status_mapper.dart';


class DocumentPreviewCard extends StatelessWidget {
  final String title;
  final DocumentStatus status;
  final String uploadDate;
  final int index;

  const DocumentPreviewCard({
    super.key,
    required this.title,
    required this.status,
    required this.uploadDate,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    String statusText;

    switch (status) {
      case DocumentStatus.verified:
        statusColor = Colors.green;
        statusText = "Verified";
        break;
      case DocumentStatus.uploaded:
        statusColor = Colors.blue;
        statusText = "Uploaded";
        break;
      case DocumentStatus.pending:
        statusColor = Colors.orange;
        statusText = "Pending";
        break;
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  height: 50,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: const BoxDecoration(
                    color: Color(0xFF2196F3),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(12),
                      bottomRight: Radius.circular(12),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: const Icon(Icons.close, color: Colors.white),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // Document Preview Box
                Container(
                  height: 400,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.textGrey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.description_outlined,
                        size: 100,
                        color: Color(0xFF2196F3),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "$title\nPDF",
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 50),

                // Status row
                _row("Status", statusText, statusColor),
                const SizedBox(height: 12),

                // Upload Date row
                _row("Upload Date", uploadDate, Colors.black),

                const SizedBox(height: 40),

                // File Picker Button (Upload / Pick File)
                _blueButton("Download Document", () async {
                  await _pickFile(context);
                }),

                const SizedBox(height: 12),

                // Close Button
                _blueButton("Close", () {
                  Navigator.pop(context);
                }),

                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ================= FILE PICKER FUNCTION =================
  Future<void> _pickFile(BuildContext context) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'png'],
      );

      if (result != null) {
        PlatformFile file = result.files.first;

        debugPrint("File name: ${file.name}");
        debugPrint("File path: ${file.path}");

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Selected: ${file.name}")),
        );
      } else {
        debugPrint("User canceled file picking");
      }
    } catch (e) {
      debugPrint("File picker error: $e");

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error picking file: $e")),
      );
    }
  }
  // =======================================================

  Widget _row(String left, String right, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(left, style: const TextStyle(color: Colors.black54)),
        Text(
          right,
          style: TextStyle(color: color, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _blueButton(String text, VoidCallback onTap) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF2196F3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        onPressed: onTap,
        child: Text(
          text,
          style: const TextStyle(color: Colors.white, fontSize: 15),
        ),
      ),
    );
  }
}
