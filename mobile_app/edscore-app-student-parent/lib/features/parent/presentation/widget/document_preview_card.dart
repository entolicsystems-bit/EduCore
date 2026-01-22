import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/core/theme/app_colours.dart';
import '../../../../core/utils/status_mapper.dart';
import '../../bloc/document/document_bloc.dart';
import '../../bloc/document/document_event.dart';
import '../../bloc/document/document_state.dart';

class DocumentPreviewCard extends StatelessWidget {
  final String title;
  final DocumentStatus status;
  final String uploadDate;
  final int index;
  final String applicationId; // Add this
  final String documentType; // Add this

  const DocumentPreviewCard({
    super.key,
    required this.title,
    required this.status,
    required this.uploadDate,
    required this.index,
    required this.applicationId,
    required this.documentType,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    String statusText;

    switch (status) {
      case DocumentStatus.verified:
        statusColor = AppColors.success;
        statusText = "Verified";
        break;
      case DocumentStatus.uploaded:
        statusColor = AppColors.info;
        statusText = "Uploaded";
        break;
      case DocumentStatus.pending:
        statusColor = AppColors.error;
        statusText = "Pending";
        break;
    }

    return BlocListener<DocumentBloc, DocumentState>(
      listener: (context, state) {
        if (state is DocumentUploadSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.green,
            ),
          );
        } else if (state is DocumentError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
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
                    height: 511,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppColors.textGrey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: BlocBuilder<DocumentBloc, DocumentState>(
                      builder: (context, state) {
                        if (state is DocumentUploading &&
                            state.index == index) {
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const CircularProgressIndicator(),
                              const SizedBox(height: 16),
                              Text(
                                "Uploading $title...",
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          );
                        }

                        return Column(
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
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 50),

                  // Status row
                  _row("Status", statusText, statusColor),
                  const SizedBox(height: 12),

                  // Upload Date row
                  _row("Upload Date", uploadDate, Colors.black),

                  const SizedBox(height: 40),

                  // Upload Document Button
                  BlocBuilder<DocumentBloc, DocumentState>(
                    builder: (context, state) {
                      final isUploading = state is DocumentUploading &&
                          state.index == index;

                      return _blueButton(
                        isUploading ? "Uploading..." : "Download Document",
                        isUploading
                            ? null
                            : () async {
                          await _pickAndUploadFile(context);
                        },
                      );
                    },
                  ),

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
      ),
    );
  }

  // ================= FILE PICKER & UPLOAD FUNCTION =================
  Future<void> _pickAndUploadFile(BuildContext context) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
      );

      if (result != null) {
        PlatformFile platformFile = result.files.first;

        // Validate file
        if (platformFile.path == null) {
          throw Exception("File path is null");
        }

        final file = File(platformFile.path!);

        // Check if file exists
        if (!await file.exists()) {
          throw Exception("File does not exist");
        }

        debugPrint("File name: ${platformFile.name}");
        debugPrint("File size: ${platformFile.size} bytes");

        // Trigger upload event
        if (context.mounted) {
          context.read<DocumentBloc>().add(
            UploadDocumentEvent(
              index: index,
              filePath: platformFile.path!,
              applicationId: applicationId,
              documentType: documentType,
            ),
          );
        }
      } else {
        debugPrint("User canceled file picking");
      }
    } catch (e) {
      debugPrint("File picker error: $e");

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
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

  Widget _blueButton(String text, VoidCallback? onTap) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF2196F3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          disabledBackgroundColor: Colors.grey,
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