import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;

import 'offer_letter_event.dart';
import 'offer_letter_state.dart';

class OfferLetterBloc extends Bloc<OfferLetterEvent, OfferLetterState> {
  static const String baseUrl = 'http://3.7.212.22:3000/v1';

  OfferLetterBloc() : super(OfferLetterInitial()) {
    on<LoadOfferLetterEvent>(_onLoadOfferLetter);
    on<LoadTimelineEvent>(_onLoadTimeline);
    on<ViewOfferLetterEvent>(_onViewOfferLetter);
    on<DownloadOfferLetterEvent>(_onDownloadOfferLetter);
    on<ConvertToStudentEvent>(_onConvertToStudent);
  }

  // --------------------------------------------------
  // LOAD OFFER LETTER DATA
  // --------------------------------------------------
  Future<void> _onLoadOfferLetter(
      LoadOfferLetterEvent event,
      Emitter<OfferLetterState> emit,
      ) async {
    if (event.applicationId.isEmpty) {
      emit(const OfferLetterError('Application ID is required'));
      return;
    }

    if (event.bearerToken.isEmpty) {
      emit(const OfferLetterError('Authentication token is required'));
      return;
    }

    emit(OfferLetterLoading());

    try {
      final url = '$baseUrl/offer-letter/${event.applicationId}/offerletter';
      print('🔍 Fetching offer letter from: $url');

      final response = await http
          .get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer ${event.bearerToken}',
          'Content-Type': 'application/json',
        },
      )
          .timeout(const Duration(seconds: 15));

      print('📡 Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        emit(OfferLetterLoaded(offerLetterData: data));

        add(LoadTimelineEvent(
          applicationId: event.applicationId,
          bearerToken: event.bearerToken,
        ));
      } else if (response.statusCode == 404) {
        emit(const OfferLetterError('Offer letter not found'));
      } else if (response.statusCode == 401) {
        emit(const OfferLetterError('Authentication failed. Please login again.'));
      } else {
        emit(OfferLetterError(
          'Failed to load offer letter (Status: ${response.statusCode})',
        ));
      }
    } on TimeoutException {
      emit(const OfferLetterError('Server timeout. Please check your internet connection and try again.'));
    } on http.ClientException catch (e) {
      emit(const OfferLetterError('Cannot connect to server. Please check if the server is running.'));
      print('❌ ClientException: $e');
    } on FormatException catch (e) {
      emit(const OfferLetterError('Invalid response from server'));
      print('❌ FormatException: $e');
    } catch (e) {
      emit(OfferLetterError('Unexpected error: ${e.toString()}'));
      print('❌ Error: $e');
    }
  }

  // --------------------------------------------------
  // LOAD TIMELINE (NON-BLOCKING)
  // --------------------------------------------------
  Future<void> _onLoadTimeline(
      LoadTimelineEvent event,
      Emitter<OfferLetterState> emit,
      ) async {
    try {
      final url = '$baseUrl/applications/${event.applicationId}/timeline';
      print('📅 Loading timeline from: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer ${event.bearerToken}',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 && state is OfferLetterLoaded) {
        final timeline = jsonDecode(response.body) as List;
        emit((state as OfferLetterLoaded).copyWith(timeline: timeline));
        print('✅ Timeline loaded successfully');
      }
    } catch (e) {
      print('⚠️ Timeline load failed (non-critical): $e');
    }
  }

  // --------------------------------------------------
  // VIEW PDF IN-APP (NEW)
  // --------------------------------------------------
  Future<void> _onViewOfferLetter(
      ViewOfferLetterEvent event,
      Emitter<OfferLetterState> emit,
      ) async {
    if (event.applicationId.isEmpty) {
      emit(const OfferLetterPdfError('Application ID is required'));
      return;
    }

    if (event.bearerToken.isEmpty) {
      emit(const OfferLetterPdfError('Authentication token is required'));
      return;
    }

    emit(OfferLetterPdfLoading());

    try {
      final url = '$baseUrl/offer-letter/${event.applicationId}/download';
      print('👁️ Fetching PDF URL for viewing: $url');

      final response = await http
          .get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer ${event.bearerToken}',
        },
      )
          .timeout(const Duration(seconds: 15));

      print('📡 View PDF response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final pdfUrl = data['url'] ?? data['pdf_url'];

        if (pdfUrl != null && pdfUrl.toString().isNotEmpty) {
          print('✅ PDF URL for viewing: $pdfUrl');
          emit(OfferLetterPdfReady(pdfUrl.toString()));
        } else {
          emit(const OfferLetterPdfError('PDF URL not found in response'));
        }
      } else if (response.statusCode == 404) {
        emit(const OfferLetterPdfError('Offer letter PDF not found'));
      } else if (response.statusCode == 401) {
        emit(const OfferLetterPdfError('Authentication failed'));
      } else {
        emit(OfferLetterPdfError(
          'Failed to load PDF (Status: ${response.statusCode})',
        ));
      }
    } on TimeoutException {
      emit(const OfferLetterPdfError('Request timeout. Please try again.'));
    } on http.ClientException catch (e) {
      emit(const OfferLetterPdfError('Cannot connect to server'));
      print('❌ ClientException: $e');
    } on FormatException catch (e) {
      emit(const OfferLetterPdfError('Invalid response from server'));
      print('❌ FormatException: $e');
    } catch (e) {
      emit(OfferLetterPdfError('Error: ${e.toString()}'));
      print('❌ Error: $e');
    }
  }

  // --------------------------------------------------
  // DOWNLOAD / OPEN OFFER LETTER PDF (EXTERNAL)
  // --------------------------------------------------
  Future<void> _onDownloadOfferLetter(
      DownloadOfferLetterEvent event,
      Emitter<OfferLetterState> emit,
      ) async {
    if (event.applicationId.isEmpty) {
      emit(const OfferLetterDownloadError('Application ID is required'));
      return;
    }

    if (event.bearerToken.isEmpty) {
      emit(const OfferLetterDownloadError('Authentication token is required'));
      return;
    }

    emit(OfferLetterDownloading());

    try {
      final url = '$baseUrl/offer-letter/${event.applicationId}/download';
      print('📥 Downloading from: $url');

      final response = await http
          .get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer ${event.bearerToken}',
        },
      )
          .timeout(const Duration(seconds: 15));

      print('📡 Download response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final pdfUrl = data['url'] ?? data['pdf_url'];

        if (pdfUrl != null && pdfUrl.toString().isNotEmpty) {
          print('✅ PDF URL: $pdfUrl');
          emit(OfferLetterDownloadSuccess(pdfUrl.toString()));
        } else {
          emit(const OfferLetterDownloadError('PDF URL not found in response'));
        }
      } else if (response.statusCode == 404) {
        emit(const OfferLetterDownloadError('Offer letter PDF not found'));
      } else if (response.statusCode == 401) {
        emit(const OfferLetterDownloadError('Authentication failed'));
      } else {
        emit(OfferLetterDownloadError(
          'Download failed (Status: ${response.statusCode})',
        ));
      }
    } on TimeoutException {
      emit(const OfferLetterDownloadError('Download timeout. Please try again.'));
    } on http.ClientException catch (e) {
      emit(const OfferLetterDownloadError('Cannot connect to server'));
      print('❌ ClientException: $e');
    } on FormatException catch (e) {
      emit(const OfferLetterDownloadError('Invalid response from server'));
      print('❌ FormatException: $e');
    } catch (e) {
      emit(OfferLetterDownloadError('Error: ${e.toString()}'));
      print('❌ Error: $e');
    }
  }

  // --------------------------------------------------
  // CONVERT TO STUDENT
  // --------------------------------------------------
  Future<void> _onConvertToStudent(
      ConvertToStudentEvent event,
      Emitter<OfferLetterState> emit,
      ) async {
    if (event.applicationId.isEmpty) {
      emit(const ConvertToStudentError('Application ID is required'));
      return;
    }

    if (event.bearerToken.isEmpty) {
      emit(const ConvertToStudentError('Authentication token is required'));
      return;
    }

    emit(ConvertingToStudent());

    try {
      final url = '$baseUrl/applications/${event.applicationId}/convert-to-student';
      print('🔄 Converting at: $url');

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer ${event.bearerToken}',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 20));

      print('📡 Convert response status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        emit(ConvertToStudentSuccess(
          message: data['message']?.toString() ?? 'Successfully converted to student',
          studentId: data['student_id']?.toString() ?? '',
          rollNumber: data['roll_number']?.toString() ?? '',
          applicationId: data['application_id']?.toString() ?? event.applicationId,
        ));
        print('✅ Conversion successful');
      } else if (response.statusCode == 400) {
        final errorData = jsonDecode(response.body);
        emit(ConvertToStudentError(
          errorData['message']?.toString() ?? 'Invalid request',
        ));
      } else if (response.statusCode == 401) {
        emit(const ConvertToStudentError('Authentication failed'));
      } else if (response.statusCode == 409) {
        emit(const ConvertToStudentError('Student already exists'));
      } else {
        try {
          final errorData = jsonDecode(response.body);
          emit(ConvertToStudentError(
            errorData['message']?.toString() ?? 'Conversion failed (Status: ${response.statusCode})',
          ));
        } catch (_) {
          emit(ConvertToStudentError('Conversion failed (Status: ${response.statusCode})'));
        }
      }
    } on TimeoutException {
      emit(const ConvertToStudentError('Request timeout. Please try again.'));
    } on http.ClientException catch (e) {
      emit(const ConvertToStudentError('Cannot connect to server'));
      print('❌ ClientException: $e');
    } on FormatException catch (e) {
      emit(const ConvertToStudentError('Invalid response from server'));
      print('❌ FormatException: $e');
    } catch (e) {
      emit(ConvertToStudentError('Error: ${e.toString()}'));
      print('❌ Error: $e');
    }
  }
}