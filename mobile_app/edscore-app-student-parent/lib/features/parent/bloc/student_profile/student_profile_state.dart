import '../../data/models/student_profile_model.dart';

class StudentProfileState {
  final bool isLoading;
  final StudentProfile? profile;
  final String? error;
  final bool isSessionExpired;

  StudentProfileState({
    this.isLoading = false,
    this.profile,
    this.error,
    this.isSessionExpired = false,
  });

  StudentProfileState copyWith({
    bool? isLoading,
    StudentProfile? profile,
    String? error,
    bool? isSessionExpired,
    bool clearError = false,
  }) {
    return StudentProfileState(
      isLoading: isLoading ?? this.isLoading,
      profile: profile ?? this.profile,
      error: clearError ? null : (error ?? this.error),
      isSessionExpired: isSessionExpired ?? this.isSessionExpired,
    );
  }
}