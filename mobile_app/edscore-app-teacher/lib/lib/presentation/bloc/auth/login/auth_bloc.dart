import 'package:flutter_bloc/flutter_bloc.dart';

import 'auth_event.dart';
import 'auth_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final Map<String, String> _adminCredentials = {
    'admin@educore.com': 'Admin@123',
    'superadmin@educore.com': 'Super@123',
    'director@educore.com': 'Director@123',
  };

  LoginBloc() : super(LoginInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
    on<LoginEmailChanged>(_onEmailChanged);
    on<LoginPasswordChanged>(_onPasswordChanged);
  }

  String? _validateEmail(String email) {
    if (email.isEmpty) return 'Email is required';
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(email)) return 'Invalid email format';
    return null;
  }

  String? _validatePassword(String password) {
    if (password.isEmpty) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  bool _isValidAdmin(String email, String password) {
    final trimmedEmail = email.toLowerCase().trim();
    return _adminCredentials.containsKey(trimmedEmail) &&
        _adminCredentials[trimmedEmail] == password;
  }

  bool _isAdminEmail(String email) {
    return _adminCredentials.containsKey(email.toLowerCase().trim());
  }

  Future<void> _onLoginSubmitted(
      LoginSubmitted event,
      Emitter<LoginState> emit,
      ) async {
    final emailError = _validateEmail(event.email);
    final passwordError = _validatePassword(event.password);

    if (emailError != null || passwordError != null) {
      emit(LoginValidating(
        emailError: emailError,
        passwordError: passwordError,
      ));
      return;
    }

    if (!_isAdminEmail(event.email)) {
      emit(LoginFailure('Access denied. Only admin users can login.'));
      return;
    }

    emit(LoginLoading());

    try {
      await Future.delayed(const Duration(seconds: 2));


      if (!_isValidAdmin(event.email, event.password)) {
        emit(LoginFailure('Invalid email or password. Please try again.'));
        return;
      }














      // TODO: Replace with your actual API call



      String adminName = event.email.split('@')[0];
      adminName = adminName[0].toUpperCase() + adminName.substring(1);


      emit(LoginSuccess(message: 'Welcome $adminName!'));
    } catch (e) {
      emit(LoginFailure('Login failed: ${e.toString()}'));
    }
  }

  void _onEmailChanged(LoginEmailChanged event, Emitter<LoginState> emit) {
    final emailError = _validateEmail(event.email);


    final passwordError = state is LoginValidating
        ? (state as LoginValidating).passwordError
        : null;

    emit(LoginValidating(
      emailError: emailError,
      passwordError: passwordError,
    ));
  }

  void _onPasswordChanged(LoginPasswordChanged event, Emitter<LoginState> emit) {
    final passwordError = _validatePassword(event.password);


    final emailError = state is LoginValidating
        ? (state as LoginValidating).emailError
        : null;

    emit(LoginValidating(
      emailError: emailError,
      passwordError: passwordError,
    ));
  }
}