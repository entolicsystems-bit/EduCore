import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/features/student/bloc/auth/reset_password/reset_event.dart';
import 'package:student/features/student/bloc/auth/reset_password/reset_state.dart';

class ResetPasswordBloc extends Bloc<ResetPasswordEvent, ResetPasswordState> {
  ResetPasswordBloc() : super(ResetPasswordInitial()) {
    on<ResetPasswordSubmitted>(_onResetPasswordSubmitted);
  }

  /// Validates password strength with comprehensive rules
  String? _validatePassword(String password) {
    if (password.isEmpty) {
      return 'Password is required';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (password.length > 64) {
      return 'Password must not exceed 64 characters';
    }

    // Check for at least one uppercase letter
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    // Check for at least one lowercase letter
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for at least one digit
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      return 'Password must contain at least one number';
    }

    // Check for at least one special character
    if (!RegExp(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]').hasMatch(password)) {
      return 'Password must contain at least one special character (!@#\$%^&*...)';
    }

    // Check for spaces (typically not allowed in passwords)
    if (password.contains(' ')) {
      return 'Password must not contain spaces';
    }

    // Optional: Check for common weak passwords
    final commonPasswords = [
      'password',
      'password123',
      '12345678',
      'qwerty123',
      'abc123456',
    ];

    if (commonPasswords.contains(password.toLowerCase())) {
      return 'This password is too common. Please choose a stronger one';
    }

    return null;
  }

  /// Validates that passwords match
  String? _validateConfirmPassword(String password, String confirmPassword) {
    if (confirmPassword.isEmpty) {
      return 'Confirm password is required';
    }

    if (password != confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  }

  Future<void> _onResetPasswordSubmitted(
      ResetPasswordSubmitted event,
      Emitter<ResetPasswordState> emit,
      ) async {
    // Validate new password
    final newPasswordError = _validatePassword(event.newPassword);

    // Validate confirm password
    final confirmPasswordError = _validateConfirmPassword(
      event.newPassword,
      event.confirmPassword,
    );

    // If there are validation errors, emit validating state
    if (newPasswordError != null || confirmPasswordError != null) {
      emit(ResetPasswordValidating(
        newPasswordError: newPasswordError,
        confirmPasswordError: confirmPasswordError,
      ));
      return;
    }

    // Emit loading state
    emit(ResetPasswordLoading());

    try {
      // TODO: Replace with your actual API call
      // Example:
      // await _authRepository.resetPassword(
      //   email: event.email,
      //   newPassword: event.newPassword,
      // );

      await Future.delayed(const Duration(seconds: 2));

      emit(ResetPasswordSuccess());
    } catch (e) {
      emit(ResetPasswordFailure(e.toString()));
    }
  }
}