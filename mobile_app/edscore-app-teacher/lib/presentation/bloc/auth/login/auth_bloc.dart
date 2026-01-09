import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;

import '../../../../core/storage/secure_token_storage.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(LoginInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  Future<void> _onLoginSubmitted(
      LoginSubmitted event,
      Emitter<LoginState> emit,
      ) async {
    emit(LoginLoading());

    try {
      // Login API request
      final response = await http.post(
        Uri.parse("http://3.7.212.22:3000/v1/auth/login"),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "email": event.email.trim(),
          "password": event.password.trim(),
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final accessToken = data['accessToken'];
        final refreshToken = data['refreshToken'];
        final expiresIn = data['expiresIn']; // optional field from server

        if (accessToken == null || refreshToken == null) {
          emit(LoginFailure("Invalid response from server"));
          return;
        }

        try {
          // Save tokens with optional expiry
          await SecureTokenStorage.saveTokens(
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpirySeconds: expiresIn ?? 900, // default 15 min
            refreshTokenExpirySeconds: 604800, // default 7 days
          );

          emit(LoginSuccess("Login successful"));
        } catch (e) {
          emit(LoginFailure("Failed to save login credentials"));
        }
      } else {
        emit(LoginFailure(data['message'] ?? "Invalid email or password"));
      }
    } catch (e) {
      emit(LoginFailure("Unable to connect to server"));
    }
  }
}
