import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:io';

class PdfViewerScreen extends StatefulWidget {
  final String pdfUrl;
  final String title;

  const PdfViewerScreen({
    super.key,
    required this.pdfUrl,
    this.title = 'Offer Letter',
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> {
  final PdfViewerController _pdfViewerController = PdfViewerController();
  int _currentPage = 1;
  int _totalPages = 0;
  bool _isDownloading = false;
  double _downloadProgress = 0.0;

  @override
  void dispose() {
    _pdfViewerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            if (_totalPages > 0)
              Text(
                'Page $_currentPage of $_totalPages',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.white70,
                ),
              ),
          ],
        ),
        backgroundColor: const Color(0xFF6C63FF),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          // Zoom Out
          IconButton(
            icon: const Icon(Icons.zoom_out, color: Colors.white),
            onPressed: () {
              _pdfViewerController.zoomLevel =
                  (_pdfViewerController.zoomLevel - 0.25).clamp(1.0, 3.0);
            },
            tooltip: 'Zoom Out',
          ),
          // Zoom In
          IconButton(
            icon: const Icon(Icons.zoom_in, color: Colors.white),
            onPressed: () {
              _pdfViewerController.zoomLevel =
                  (_pdfViewerController.zoomLevel + 0.25).clamp(1.0, 3.0);
            },
            tooltip: 'Zoom In',
          ),
          // Download
          IconButton(
            icon: _isDownloading
                ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                color: Colors.white,
                strokeWidth: 2,
              ),
            )
                : const Icon(Icons.download, color: Colors.white),
            onPressed: _isDownloading ? null : _downloadPdf,
            tooltip: 'Download PDF',
          ),
          // Open in Browser
          IconButton(
            icon: const Icon(Icons.open_in_browser, color: Colors.white),
            onPressed: _openInBrowser,
            tooltip: 'Open in Browser',
          ),
        ],
      ),
      body: Stack(
        children: [
          // PDF Viewer
          SfPdfViewer.network(
            widget.pdfUrl,
            controller: _pdfViewerController,
            enableDoubleTapZooming: true,
            enableTextSelection: true,
            onDocumentLoaded: (PdfDocumentLoadedDetails details) {
              setState(() {
                _totalPages = details.document.pages.count;
              });
            },
            onPageChanged: (PdfPageChangedDetails details) {
              setState(() {
                _currentPage = details.newPageNumber;
              });
            },
          ),

          // Download Progress Indicator
          if (_isDownloading)
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black87,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Downloading... ${(_downloadProgress * 100).toStringAsFixed(0)}%',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 10),
                    LinearProgressIndicator(
                      value: _downloadProgress,
                      backgroundColor: Colors.grey[700],
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6C63FF)),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),

      // Page Navigation Controls
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Previous Page
            ElevatedButton.icon(
              onPressed: _currentPage > 1
                  ? () {
                _pdfViewerController.previousPage();
              }
                  : null,
              icon: const Icon(Icons.arrow_back_ios, size: 16),
              label: Text('Previous', style: GoogleFonts.poppins(fontSize: 13)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C63FF),
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey[300],
                disabledForegroundColor: Colors.grey[600],
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              ),
            ),

            // Page Indicator
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '$_currentPage / $_totalPages',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF6C63FF),
                ),
              ),
            ),

            // Next Page
            ElevatedButton.icon(
              onPressed: _currentPage < _totalPages
                  ? () {
                _pdfViewerController.nextPage();
              }
                  : null,
              icon: const Icon(Icons.arrow_forward_ios, size: 16),
              label: Text('Next', style: GoogleFonts.poppins(fontSize: 13)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C63FF),
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey[300],
                disabledForegroundColor: Colors.grey[600],
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Download PDF to device using http package
  Future<void> _downloadPdf() async {
    setState(() {
      _isDownloading = true;
      _downloadProgress = 0.0;
    });

    try {
      // Request storage permission
      var status = await Permission.storage.status;
      if (!status.isGranted) {
        status = await Permission.storage.request();
        if (!status.isGranted) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Storage permission is required to download files',
                  style: GoogleFonts.poppins(),
                ),
                backgroundColor: Colors.red,
              ),
            );
          }
          setState(() => _isDownloading = false);
          return;
        }
      }

      // Get download directory
      Directory? directory;
      if (Platform.isAndroid) {
        directory = Directory('/storage/emulated/0/Download');
        if (!await directory.exists()) {
          directory = await getExternalStorageDirectory();
        }
      } else {
        directory = await getApplicationDocumentsDirectory();
      }

      final fileName = 'offer_letter_${DateTime.now().millisecondsSinceEpoch}.pdf';
      final filePath = '${directory!.path}/$fileName';

      print('📥 Downloading PDF to: $filePath');

      // Download using http package with streaming
      final request = http.Request('GET', Uri.parse(widget.pdfUrl));
      final response = await http.Client().send(request);

      if (response.statusCode != 200) {
        throw Exception('Failed to download PDF: ${response.statusCode}');
      }

      final contentLength = response.contentLength ?? 0;
      final file = File(filePath);
      final sink = file.openWrite();
      var downloaded = 0;

      await for (var chunk in response.stream) {
        sink.add(chunk);
        downloaded += chunk.length;

        if (contentLength > 0) {
          setState(() {
            _downloadProgress = downloaded / contentLength;
          });
        }
      }

      await sink.close();

      setState(() => _isDownloading = false);

      print('✅ PDF downloaded successfully to: $filePath');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Downloaded successfully!',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
            action: SnackBarAction(
              label: 'Open',
              textColor: Colors.white,
              onPressed: () async {
                final fileUri = Uri.file(filePath);
                if (await canLaunchUrl(fileUri)) {
                  await launchUrl(fileUri);
                }
              },
            ),
          ),
        );
      }
    } catch (e) {
      setState(() => _isDownloading = false);

      print('❌ Download error: $e');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Download failed: ${e.toString()}',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    }
  }

  // Open PDF in external browser
  Future<void> _openInBrowser() async {
    try {
      final url = Uri.parse(widget.pdfUrl);
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
        print('✅ Opened in browser');
      } else {
        throw 'Could not launch URL';
      }
    } catch (e) {
      print('❌ Error opening in browser: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Cannot open URL: $e',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}