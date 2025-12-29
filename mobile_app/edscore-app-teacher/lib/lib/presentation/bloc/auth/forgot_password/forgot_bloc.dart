import 'package:flutter_bloc/flutter_bloc.dart';

import 'forgot_event.dart';
import 'forgot_state.dart';

class ForgotPasswordBloc extends Bloc<ForgotPasswordEvent, ForgotPasswordState> {
  ForgotPasswordBloc() : super(ForgotPasswordInitial()) {
    on<ForgotPasswordSubmitted>(_onForgotPasswordSubmitted);
    on<ForgotPasswordEmailChanged>(_onEmailChanged);
  }

  String? _validateEmail(String email) {
    if (email.isEmpty) return 'Email is required';
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(email)) return 'Invalid email format';
    return null;
  }

  Future<void> _onForgotPasswordSubmitted(
      ForgotPasswordSubmitted event,
      Emitter<ForgotPasswordState> emit,
      ) async {
    final emailError = _validateEmail(event.email);

    if (emailError != null) {
      emit(ForgotPasswordValidating(emailError: emailError));
      return;
    }

    emit(ForgotPasswordLoading());

    try {
      await Future.delayed(const Duration(seconds: 2));
      // TODO: Replace with your API call
      emit(ForgotPasswordSuccess(event.email));
    } catch (e) {
      emit(ForgotPasswordFailure(e.toString()));
    }
  }

  void _onEmailChanged(ForgotPasswordEmailChanged event, Emitter<ForgotPasswordState> emit) {
    final error = _validateEmail(event.email);
    if (error != null) {
      emit(ForgotPasswordValidating(emailError: error));
    } else {
      emit(ForgotPasswordInitial());
    }
  }
}
