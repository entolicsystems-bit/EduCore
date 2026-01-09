
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/features/student/bloc/auth/reset_password/reset_event.dart';
import 'package:student/features/student/bloc/auth/reset_password/reset_state.dart';

class ResetPasswordBloc extends Bloc<ResetPasswordEvent, ResetPasswordState> {
  ResetPasswordBloc() : super(ResetPasswordInitial()) {
    on<ResetPasswordSubmitted>(_onResetPasswordSubmitted);
  }

  String? _validatePassword(String password) {
    if (password.isEmpty) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  Future<void> _onResetPasswordSubmitted(
      ResetPasswordSubmitted event,
      Emitter<ResetPasswordState> emit,
      ) async {
    final newPasswordError = _validatePassword(event.newPassword);
    String? confirmPasswordError;

    if (event.confirmPassword.isEmpty) {
      confirmPasswordError = 'Confirm password is required';
    } else if (event.newPassword != event.confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }

    if (newPasswordError != null || confirmPasswordError != null) {
      emit(ResetPasswordValidating(
        newPasswordError: newPasswordError,
        confirmPasswordError: confirmPasswordError,
      ));
      return;
    }

    emit(ResetPasswordLoading());

    try {
      await Future.delayed(const Duration(seconds: 2));
      // TODO: Replace with your API call
      emit(ResetPasswordSuccess());
    } catch (e) {
      emit(ResetPasswordFailure(e.toString()));
    }
  }
}
//