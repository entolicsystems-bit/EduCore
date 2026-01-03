import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'parent_event.dart';
import 'parent_state.dart';

class ParentBloc extends Bloc<ParentEvent, ParentState> {
  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  ParentBloc() : super(const ParentState()) {
    on<ParentEmailChanged>((event, emit) {
      emit(state.copyWith(email: event.email, errorMessage: null));
    });

    on<ParentPasswordChanged>((event, emit) {
      emit(state.copyWith(password: event.password, errorMessage: null));
    });

    on<ParentTogglePasswordVisibility>((event, emit) {
      emit(state.copyWith(isPasswordVisible: !state.isPasswordVisible));
    });

    on<ParentLoginSubmitted>((event, emit) async {
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
        // API Call
        final response = await http.post(
          Uri.parse('http://3.7.212.22:3000/v1/auth/login'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'email': state.email,
            'password': state.password,
          }),
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          final data = jsonDecode(response.body);

          // Save tokens securely
          await _storage.write(key: 'parent_access_token', value: data['accessToken']);
          await _storage.write(key: 'parent_refresh_token', value: data['refreshToken']);
          await _storage.write(key: 'parent_email', value: state.email);
          await _storage.write(key: 'user_type', value: 'parent');

          // Set token expiry (15 minutes from now)
          final expiryTime = DateTime.now().add(const Duration(minutes: 15));
          await _storage.write(key: 'parent_token_expiry', value: expiryTime.toIso8601String());

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
        } else {
          final error = jsonDecode(response.body);
          emit(state.copyWith(
            isLoading: false,
            errorMessage: error['message'] ?? 'Invalid email or password',
          ));
        }
      } catch (e) {
        String errorMsg = 'Login failed. Please try again.';

        if (e.toString().contains('SocketException') ||
            e.toString().contains('Failed host lookup')) {
          errorMsg = 'Network error. Please check your connection.';
        }

        emit(state.copyWith(
          isLoading: false,
          errorMessage: errorMsg,
        ));
      }
    });

    on<ParentCheckAuthStatus>((event, emit) async {
      final accessToken = await _storage.read(key: 'parent_access_token');
      final refreshToken = await _storage.read(key: 'parent_refresh_token');

      if (accessToken != null && refreshToken != null) {
        // Check if token is expired
        final expiryString = await _storage.read(key: 'parent_token_expiry');
        bool isExpired = true;

        if (expiryString != null) {
          final expiryTime = DateTime.parse(expiryString);
          isExpired = DateTime.now().isAfter(expiryTime);
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

    on<ParentLogoutRequested>((event, emit) async {
      try {
        final refreshToken = await _storage.read(key: 'parent_refresh_token');

        if (refreshToken != null) {
          // Call logout API
          await http.post(
            Uri.parse('http://3.7.212.22:3000/v1/auth/logout'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'refreshToken': refreshToken}),
          );
        }
      } catch (e) {
        print('Logout API error: $e');
      } finally {
        // Clear parent-specific stored data
        await _storage.delete(key: 'parent_access_token');
        await _storage.delete(key: 'parent_refresh_token');
        await _storage.delete(key: 'parent_email');
        await _storage.delete(key: 'parent_token_expiry');

        emit(const ParentState(
          isAuthenticated: false,
        ));
      }
    });
  }
}