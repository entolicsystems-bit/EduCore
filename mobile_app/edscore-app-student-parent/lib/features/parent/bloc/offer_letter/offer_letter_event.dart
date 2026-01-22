import 'package:equatable/equatable.dart';

abstract class OfferLetterEvent extends Equatable {
  const OfferLetterEvent();

  @override
  List<Object?> get props => [];
}

class LoadOfferLetterEvent extends OfferLetterEvent {
  final String applicationId;
  final String bearerToken;

  const LoadOfferLetterEvent({
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  List<Object?> get props => [applicationId, bearerToken];
}

class LoadTimelineEvent extends OfferLetterEvent {
  final String applicationId;
  final String bearerToken;

  const LoadTimelineEvent({
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  List<Object?> get props => [applicationId, bearerToken];
}

// NEW: View PDF in-app
class ViewOfferLetterEvent extends OfferLetterEvent {
  final String applicationId;
  final String bearerToken;

  const ViewOfferLetterEvent({
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  List<Object?> get props => [applicationId, bearerToken];
}

// External download
class DownloadOfferLetterEvent extends OfferLetterEvent {
  final String applicationId;
  final String bearerToken;

  const DownloadOfferLetterEvent({
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  List<Object?> get props => [applicationId, bearerToken];
}

class ConvertToStudentEvent extends OfferLetterEvent {
  final String applicationId;
  final String bearerToken;

  const ConvertToStudentEvent({
    required this.applicationId,
    required this.bearerToken,
  });

  @override
  List<Object?> get props => [applicationId, bearerToken];
}