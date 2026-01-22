import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/theme/app_colours.dart';
import '../../bloc/offer_letter/offer_letter_bloc.dart';
import '../../bloc/offer_letter/offer_letter_event.dart';
import '../../bloc/offer_letter/offer_letter_state.dart';
import 'pdf_viewer_screen.dart';

class OfferLetterScreen extends StatelessWidget {
  final String applicationId;
  final String bearerToken;

  const OfferLetterScreen({
    super.key,
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  Widget build(BuildContext context) {
    print('🎯 OfferLetterScreen initialized');
    print('   applicationId: "$applicationId"');
    print('   bearerToken length: ${bearerToken.length}');

    if (applicationId.isEmpty) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text('Offer Letter', style: GoogleFonts.poppins()),
          backgroundColor: AppColors.primary,
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 60, color: Colors.red),
                const SizedBox(height: 20),
                Text(
                  'Invalid Application ID',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.red,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Application ID is required to view the offer letter.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(color: Colors.grey),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('Go Back', style: GoogleFonts.poppins()),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return BlocProvider(
      create: (context) => OfferLetterBloc()
        ..add(LoadOfferLetterEvent(
          applicationId: applicationId,
          bearerToken: bearerToken,
        )),
      child: OfferLetterView(
        applicationId: applicationId,
        bearerToken: bearerToken,
      ),
    );
  }
}

class OfferLetterView extends StatelessWidget {
  final String applicationId;
  final String bearerToken;

  const OfferLetterView({
    super.key,
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocListener<OfferLetterBloc, OfferLetterState>(
        listener: (context, state) {
          // Navigate to PDF Viewer
          if (state is OfferLetterPdfReady) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PdfViewerScreen(
                  pdfUrl: state.pdfUrl,
                  title: 'Offer Letter',
                ),
              ),
            );
          }
          // External download success
          else if (state is OfferLetterDownloadSuccess) {
            _launchUrl(state.url, context);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Opening offer letter...', style: GoogleFonts.poppins()),
                backgroundColor: Colors.green,
              ),
            );
          }
          // PDF loading error
          else if (state is OfferLetterPdfError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message, style: GoogleFonts.poppins()),
                backgroundColor: Colors.red,
                duration: const Duration(seconds: 4),
              ),
            );
          }
          // Download error
          else if (state is OfferLetterDownloadError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message, style: GoogleFonts.poppins()),
                backgroundColor: Colors.red,
                duration: const Duration(seconds: 4),
              ),
            );
          }
          // Conversion success
          else if (state is ConvertToStudentSuccess) {
            _showConversionSuccessDialog(context, state);
          }
          // Conversion error
          else if (state is ConvertToStudentError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message, style: GoogleFonts.poppins()),
                backgroundColor: Colors.red,
                duration: const Duration(seconds: 4),
              ),
            );
          }
        },
        child: Column(
          children: [
            // ======= HEADER =======
            Container(
              height: 110,
              padding: const EdgeInsets.only(top: 40, left: 12, right: 12),
              decoration: const BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(16),
                  bottomRight: Radius.circular(16),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Offer Letter",
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          "Your Child's Offer Letter !!",
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // ======= BODY =======
            Expanded(
              child: BlocBuilder<OfferLetterBloc, OfferLetterState>(
                builder: (context, state) {
                  if (state is OfferLetterLoading) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const CircularProgressIndicator(),
                          const SizedBox(height: 20),
                          Text(
                            'Loading offer letter...',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    );
                  } else if (state is OfferLetterError) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.error_outline,
                              size: 60,
                              color: Colors.red,
                            ),
                            const SizedBox(height: 20),
                            Text(
                              'Error Loading Offer Letter',
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.red,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              state.message,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.red.shade700,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 20),
                            ElevatedButton.icon(
                              onPressed: () {
                                context.read<OfferLetterBloc>().add(
                                  LoadOfferLetterEvent(
                                    applicationId: applicationId,
                                    bearerToken: bearerToken,
                                  ),
                                );
                              },
                              icon: const Icon(Icons.refresh),
                              label: Text('Retry', style: GoogleFonts.poppins()),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                  vertical: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  } else if (state is OfferLetterLoaded ||
                      state is OfferLetterPdfLoading ||
                      state is OfferLetterDownloading ||
                      state is ConvertingToStudent) {
                    final isProcessing = state is OfferLetterPdfLoading ||
                        state is OfferLetterDownloading ||
                        state is ConvertingToStudent;

                    return SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                      child: Center(
                        child: Container(
                          width: 350,
                          decoration: BoxDecoration(
                            color: AppColors.cardBg,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: const [
                              BoxShadow(
                                color: AppColors.shadow,
                                blurRadius: 6,
                                offset: Offset(0, 2),
                              )
                            ],
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // LOGO
                                Container(
                                  height: 80,
                                  width: 80,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(20),
                                    color: AppColors.primary,
                                  ),
                                  child: Center(
                                    child: Text(
                                      "Z",
                                      style: GoogleFonts.poppins(
                                        color: Colors.white,
                                        fontSize: 50,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 10),

                                // SCHOOL NAME
                                Text(
                                  "Zp school pune",
                                  style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textDark,
                                  ),
                                ),

                                const SizedBox(height: 4),

                                // ADDRESS
                                Text(
                                  "Chartrapati shivaji maharaj\nchowk, Hinjvadi, pune",
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.poppins(
                                    fontSize: 13,
                                    color: AppColors.textGrey,
                                  ),
                                ),

                                const SizedBox(height: 15),

                                const Divider(
                                  color: AppColors.border,
                                  thickness: 1.5,
                                ),

                                const SizedBox(height: 10),

                                // SUBJECT
                                Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Subject: Admission Offer for Grade 10-A",
                                    style: GoogleFonts.poppins(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textDark,
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 10),

                                // DATE
                                Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Date: 20 December 2024",
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: AppColors.textDark,
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 10),

                                // TO ADDRESS
                                Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "To,\nMr. Rajesh Kumar\n123, MG Road,\nKorangamala, Bangalore – 560034",
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: AppColors.textDark,
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 10),

                                // BODY TEXT
                                Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Dear Mr. Rajesh Kumar,\n\n"
                                        "We are pleased to inform you that your child, Aarav Kumar, has been selected for admission to Grade 9-A for the academic year 2024–2025 at EntoCrm International School.\n\n"
                                        "This admission offer is based on Aarav's performance during the admission process and the successful review of the submitted documents.\n\n"
                                        "We look forward to welcoming Aarav to our school community.",
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: AppColors.textDark,
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 20),

                                // ACTION BUTTONS
                                Row(
                                  children: [
                                    // View PDF Button
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: isProcessing
                                            ? null
                                            : () {
                                          context
                                              .read<OfferLetterBloc>()
                                              .add(
                                            ViewOfferLetterEvent(
                                              applicationId:
                                              applicationId,
                                              bearerToken:
                                              bearerToken,
                                            ),
                                          );
                                        },
                                        icon: const Icon(Icons.visibility,
                                            size: 18),
                                        label: Text(
                                          'View PDF',
                                          style: GoogleFonts.poppins(
                                              fontSize: 14),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppColors.primary,
                                          foregroundColor: Colors.white,
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          disabledBackgroundColor:
                                          Colors.grey.shade400,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    // Download Button
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: isProcessing
                                            ? null
                                            : () {
                                          context
                                              .read<OfferLetterBloc>()
                                              .add(
                                            DownloadOfferLetterEvent(
                                              applicationId:
                                              applicationId,
                                              bearerToken:
                                              bearerToken,
                                            ),
                                          );
                                        },
                                        icon: const Icon(Icons.download,
                                            size: 18),
                                        label: Text(
                                          'Download',
                                          style: GoogleFonts.poppins(
                                              fontSize: 14),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.blue,
                                          foregroundColor: Colors.white,
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          disabledBackgroundColor:
                                          Colors.grey.shade400,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 10),

                                // Convert Button (Full Width)
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton.icon(
                                    onPressed: isProcessing
                                        ? null
                                        : () => _showConvertConfirmation(context),
                                    icon: const Icon(Icons.person_add, size: 18),
                                    label: Text(
                                      'Convert to Student',
                                      style: GoogleFonts.poppins(fontSize: 14),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                      foregroundColor: Colors.white,
                                      padding:
                                      const EdgeInsets.symmetric(vertical: 12),
                                      disabledBackgroundColor:
                                      Colors.grey.shade400,
                                    ),
                                  ),
                                ),

                                if (isProcessing) ...[
                                  const SizedBox(height: 15),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Text(
                                        state is OfferLetterPdfLoading
                                            ? 'Loading PDF viewer...'
                                            : state is OfferLetterDownloading
                                            ? 'Processing download...'
                                            : 'Converting to student...',
                                        style: GoogleFonts.poppins(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  return const SizedBox.shrink();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _launchUrl(String urlString, BuildContext context) async {
    if (urlString.isEmpty) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Invalid URL', style: GoogleFonts.poppins()),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    final url = Uri.parse(urlString);
    print('🌐 Attempting to launch URL: $urlString');

    try {
      if (await canLaunchUrl(url)) {
        final launched =
        await launchUrl(url, mode: LaunchMode.externalApplication);
        print('✅ URL launched successfully: $launched');
      } else {
        print('❌ Cannot launch URL: $urlString');
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Cannot open this URL', style: GoogleFonts.poppins()),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      print('❌ Error launching URL: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error opening URL: $e', style: GoogleFonts.poppins()),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _showConvertConfirmation(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text('Convert to Student',
            style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        content: Text(
          'Are you sure you want to convert this application to a student?\n\nThis action will create a new student record.',
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: Text('Cancel',
                style: GoogleFonts.poppins(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: Text('Convert', style: GoogleFonts.poppins()),
          ),
        ],
      ),
    );

    if (confirm == true && context.mounted) {
      print('🔄 User confirmed conversion');
      context.read<OfferLetterBloc>().add(
        ConvertToStudentEvent(
          applicationId: applicationId,
          bearerToken: bearerToken,
        ),
      );
    }
  }

  void _showConversionSuccessDialog(
      BuildContext context, ConvertToStudentSuccess state) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 28),
            const SizedBox(width: 10),
            Text(
              'Success',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(state.message, style: GoogleFonts.poppins(fontSize: 14)),
            const SizedBox(height: 15),
            const Divider(),
            const SizedBox(height: 10),
            if (state.studentId.isNotEmpty) ...[
              Row(
                children: [
                  const Icon(Icons.person, size: 18, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    'Student ID: ',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      state.studentId,
                      style: GoogleFonts.poppins(fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
            ],
            if (state.rollNumber.isNotEmpty) ...[
              Row(
                children: [
                  const Icon(Icons.numbers, size: 18, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    'Roll Number: ',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      state.rollNumber,
                      style: GoogleFonts.poppins(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: Text('OK', style: GoogleFonts.poppins()),
          ),
        ],
      ),
    );
  }
}