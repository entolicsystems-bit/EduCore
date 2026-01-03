import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'login_event.dart';
import 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

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
      if (state.email.isEmpty || state.password.isEmpty) {
        emit(state.copyWith(errorMessage: 'Please fill in all fields'));
        return;
      }

      // Email validation
      final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
      if (!emailRegex.hasMatch(state.email)) {
        emit(state.copyWith(errorMessage: 'Please enter a valid email'));
        return;
      }

      emit(state.copyWith(isLoading: true, errorMessage: null));

      try {
        // API Call with timeout
        final response = await http
            .post(
          Uri.parse('http://3.7.212.22:3000/v1/auth/login'),
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

        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');

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

          // Save tokens securely
          await _storage.write(key: 'access_token', value: data['accessToken']);
          await _storage.write(key: 'refresh_token', value: data['refreshToken']);
          await _storage.write(key: 'user_email', value: state.email.trim());
          await _storage.write(key: 'user_type', value: 'student');

          // Set token expiry (15 minutes from now)
          final expiryTime = DateTime.now().add(const Duration(minutes: 15));
          await _storage.write(
            key: 'token_expiry',
            value: expiryTime.toIso8601String(),
          );

          print('✅ Login successful - Tokens saved');

          emit(state.copyWith(
            isLoading: false,
            isSuccess: true,
            isAuthenticated: true,
            accessToken: data['accessToken'],
            refreshToken: data['refreshToken'],
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
        print('❌ Timeout exception');
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Connection timeout. Please check your internet.',
        ));
      } on SocketException catch (_) {
        print('❌ Socket exception');
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'No internet connection.',
        ));
      } on FormatException catch (_) {
        print('❌ Format exception');
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid response format from server.',
        ));
      } on http.ClientException catch (_) {
        print('❌ Client exception');
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Network error. Please try again.',
        ));
      } catch (e) {
        print('❌ Unknown error: $e');
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Login failed: ${e.toString()}',
        ));
      }
    });

    on<CheckAuthStatus>((event, emit) async {
      final accessToken = await _storage.read(key: 'access_token');
      final refreshToken = await _storage.read(key: 'refresh_token');

      if (accessToken != null && refreshToken != null) {
        // Check if token is expired
        final expiryString = await _storage.read(key: 'token_expiry');
        bool isExpired = true;

        if (expiryString != null) {
          try {
            final expiryTime = DateTime.parse(expiryString);
            isExpired = DateTime.now().isAfter(expiryTime);
          } catch (_) {
            isExpired = true;
          }
        }

        if (!isExpired) {
          emit(state.copyWith(
            isAuthenticated: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
          ));
        }
      }
    });

    on<LogoutRequested>((event, emit) async {
      try {
        final refreshToken = await _storage.read(key: 'refresh_token');

        if (refreshToken != null) {
          // Call logout API with timeout
          await http
              .post(
            Uri.parse('http://3.7.212.22:3000/v1/auth/logout'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'refreshToken': refreshToken}),
          )
              .timeout(const Duration(seconds: 10));
        }
      } catch (e) {
        print('Logout API error: $e');
      } finally {
        // Clear all stored data
        await _storage.deleteAll();

        emit(const LoginState(
          isAuthenticated: false,
        ));
      }
    });
  }
}