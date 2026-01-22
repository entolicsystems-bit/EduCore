import 'package:equatable/equatable.dart';

abstract class OfferLetterState extends Equatable {
  const OfferLetterState();

  @override
  List<Object?> get props => [];
}

class OfferLetterInitial extends OfferLetterState {}

class OfferLetterLoading extends OfferLetterState {}

class OfferLetterLoaded extends OfferLetterState {
  final Map<String, dynamic> offerLetterData;
  final List<dynamic> timeline;

  const OfferLetterLoaded({
    required this.offerLetterData,
    this.timeline = const [],
  });

  @override
  List<Object?> get props => [offerLetterData, timeline];

  OfferLetterLoaded copyWith({
    Map<String, dynamic>? offerLetterData,
    List<dynamic>? timeline,
  }) {
    return OfferLetterLoaded(
      offerLetterData: offerLetterData ?? this.offerLetterData,
      timeline: timeline ?? this.timeline,
    );
  }
}

class OfferLetterError extends OfferLetterState {
  final String message;
  const OfferLetterError(this.message);

  @override
  List<Object?> get props => [message];
}

/* ================= PDF VIEWER STATES ================= */

class OfferLetterPdfLoading extends OfferLetterState {}

class OfferLetterPdfReady extends OfferLetterState {
  final String pdfUrl;
  const OfferLetterPdfReady(this.pdfUrl);

  @override
  List<Object?> get props => [pdfUrl];
}

class OfferLetterPdfError extends OfferLetterState {
  final String message;
  const OfferLetterPdfError(this.message);

  @override
  List<Object?> get props => [message];
}

/* ================= DOWNLOAD STATES ================= */

class OfferLetterDownloading extends OfferLetterState {}

class OfferLetterDownloadSuccess extends OfferLetterState {
  final String url;
  const OfferLetterDownloadSuccess(this.url);

  @override
  List<Object?> get props => [url];
}

class OfferLetterDownloadError extends OfferLetterState {
  final String message;
  const OfferLetterDownloadError(this.message);

  @override
  List<Object?> get props => [message];
}

/* ================= CONVERT STATES ================= */

class ConvertingToStudent extends OfferLetterState {}

class ConvertToStudentSuccess extends OfferLetterState {
  final String message;
  final String studentId;
  final String rollNumber;
  final String applicationId;

  const ConvertToStudentSuccess({
    required this.message,
    required this.studentId,
    required this.rollNumber,
    required this.applicationId,
  });

  @override
  List<Object?> get props => [message, studentId, rollNumber, applicationId];
}

class ConvertToStudentError extends OfferLetterState {
  final String message;
  const ConvertToStudentError(this.message);

  @override
  List<Object?> get props => [message];
}