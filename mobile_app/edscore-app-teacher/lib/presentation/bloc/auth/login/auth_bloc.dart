
import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;

import 'auth_event.dart';
import 'auth_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(LoginInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  Future<void> _onLoginSubmitted(
      LoginSubmitted event, Emitter<LoginState> emit) async {
    emit(LoginLoading());

    try {
      final response = await http.post(
        Uri.parse("http://3.7.212.22:3000/v1/auth/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": event.email.trim(),
          "password": event.password.trim(),
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        emit(LoginSuccess(data['message'] ?? 'Login successful'));
      } else {
        final data = jsonDecode(response.body);
        emit(LoginFailure(data['message'] ?? 'Invalid email or password'));
      }
    } catch (e) {
      emit(LoginFailure("Unable to connect to server"));
    }
  }
}