import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:student/core/constants/api_constants.dart';
import 'package:student/core/storage/secure_token_storage.dart';

import 'login_event.dart';
import 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(const LoginState()) {
    on<EmailChanged>((event, emit) {
      emit(state.copyWith(email: event.email, errorMessage: null));
    });

    on<PasswordChanged>((event, emit) {
      emit(state.copyWith(password: event.password, errorMessage: null));
    });

    on<TogglePasswordVisibility>((event, emit) {
      emit(state.copyWith(isPasswordVisible: !state.isPasswordVisible));
    });

    on<LoginSubmitted>((event, emit) async {
      // Validation
      if (state.email.trim().isEmpty || state.password.isEmpty) {
        emit(state.copyWith(errorMessage: 'Please fill in all fields'));
        return;
      }

      // Email validation
      final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
      if (!emailRegex.hasMatch(state.email.trim())) {
        emit(state.copyWith(errorMessage: 'Please enter a valid email'));
        return;
      }

      emit(state.copyWith(isLoading: true, errorMessage: null));

      try {
        // API Call using ApiConstants
        final response = await http
            .post(
          Uri.parse(ApiConstants.getUrl(ApiConstants.login)),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'email': state.email.trim(),
            'password': state.password,
          }),
        )
            .timeout(
          const Duration(seconds: 15),
          onTimeout: () {
            throw TimeoutException('Request timeout');
          },
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          final data = jsonDecode(response.body);

          // Validate response data
          if (data['accessToken'] == null || data['refreshToken'] == null) {
            emit(state.copyWith(
              isLoading: false,
              errorMessage: 'Invalid response from server',
            ));
            return;
          }

          // Decode JWT to check role
          final decodedToken = _decodeJWT(data['accessToken']);
          final role = decodedToken['role']?.toString().toUpperCase();

          // Validate that user is either STUDENT or PARENT
          if (role == null) {
            emit(state.copyWith(
              isLoading: false,
              errorMessage: 'Invalid token: role not found',
            ));
            return;
          }

          if (role != 'STUDENT' && role != 'PARENT') {
            emit(state.copyWith(
              isLoading: false,
              errorMessage: 'Access denied. This app is only for students and parents.',
            ));
            return;
          }

          // Save tokens and user info using SecureTokenStorage
          await Future.wait([
            SecureTokenStorage.saveTokens(
              data['accessToken'],
              data['refreshToken'],
            ),
            SecureTokenStorage.saveUserInfo(
              email: state.email.trim(),
              role: role,
            ),
            SecureTokenStorage.saveTokenExpiry(
              DateTime.now().add(const Duration(minutes: 15)),
            ),
          ]);

          emit(state.copyWith(
            isLoading: false,
            isSuccess: true,
            isAuthenticated: true,
            accessToken: data['accessToken'],
            refreshToken: data['refreshToken'],
            userRole: role,
          ));

          // Reset success state after delay
          await Future.delayed(const Duration(milliseconds: 500));
          emit(state.copyWith(isSuccess: false));
        } else if (response.statusCode == 401) {
          emit(state.copyWith(
            isLoading: false,
            errorMessage: 'Invalid email or password',
          ));
        } else if (response.statusCode == 400) {
          try {
            final error = jsonDecode(response.body);
            emit(state.copyWith(
              isLoading: false,
              errorMessage: error['message'] ?? 'Bad request',
            ));
          } catch (_) {
            emit(state.copyWith(
              isLoading: false,
              errorMessage: 'Invalid request',
            ));
          }
        } else if (response.statusCode >= 500) {
          emit(state.copyWith(
            isLoading: false,
            errorMessage: 'Server error. Please try again later.',
          ));
        } else {
          emit(state.copyWith(
            isLoading: false,
            errorMessage: 'Login failed. Please try again.',
          ));
        }
      } on TimeoutException catch (_) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Connection timeout. Please check your internet.',
        ));
      } on SocketException catch (_) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'No internet connection.',
        ));
      } on FormatException catch (_) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid response format from server.',
        ));
      } on http.ClientException catch (_) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Network error. Please try again.',
        ));
      } catch (e) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Login failed. Please try again.',
        ));
      }
    });

    on<CheckAuthStatus>((event, emit) async {
      final isLoggedIn = await SecureTokenStorage.isLoggedIn();

      if (isLoggedIn) {
        final accessToken = await SecureTokenStorage.getAccessToken();
        final refreshToken = await SecureTokenStorage.getRefreshToken();
        final userRole = await SecureTokenStorage.getRole();

        emit(state.copyWith(
          isAuthenticated: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
          userRole: userRole,
        ));
      }
    });

    on<LogoutRequested>((event, emit) async {
      try {
        final refreshToken = await SecureTokenStorage.getRefreshToken();

        if (refreshToken != null) {
          // Call logout API using ApiConstants
          await http
              .post(
            Uri.parse(ApiConstants.getUrl(ApiConstants.logout)),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'refreshToken': refreshToken}),
          )
              .timeout(const Duration(seconds: 10));
        }
      } catch (e) {
        // Silently handle logout API errors
      } finally {
        // Clear all stored data using SecureTokenStorage
        await SecureTokenStorage.clear();

        emit(const LoginState(
          isAuthenticated: false,
        ));
      }
    });
  }

  // Helper function to decode JWT and extract role
  Map<String, dynamic> _decodeJWT(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) {
        throw Exception('Invalid token');
      }

      // Decode the payload (second part)
      final payload = parts[1];
      final normalized = base64Url.normalize(payload);
      final decoded = utf8.decode(base64Url.decode(normalized));
      return jsonDecode(decoded);
    } catch (e) {
      return {};
    }
  }
}
//login bloc