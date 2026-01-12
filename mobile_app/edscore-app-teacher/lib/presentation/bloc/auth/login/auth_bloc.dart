import 'dart:convert';
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;

import '../../../../core/storage/secure_token_storage.dart';
import '../../../../core/constants/api_constants.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  // Reuse HTTP client for better performance
  static final _client = http.Client();

  LoginBloc() : super(LoginInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  // Helper function to decode JWT and extract role & expiry
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

  // Extract expiry seconds from JWT
  int _extractExpiryFromJWT(String token) {
    try {
      final decoded = _decodeJWT(token);
      final exp = decoded['exp'];

      if (exp == null) return 900; // Default 15 minutes

      // Calculate seconds until expiry
      final expiryTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
      final now = DateTime.now();
      final secondsUntilExpiry = expiryTime.difference(now).inSeconds;

      return secondsUntilExpiry > 0 ? secondsUntilExpiry : 900;
    } catch (e) {
      return 900; // Default 15 minutes
    }
  }

  Future<void> _onLoginSubmitted(
      LoginSubmitted event,
      Emitter<LoginState> emit,
      ) async {
    emit(LoginLoading());

    try {
      // Step 1: API Call using ApiConstants
      final response = await _client
          .post(
        Uri.parse(ApiConstants.getUrl(ApiConstants.login)),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "email": event.email.trim(),
          "password": event.password.trim(),
        }),
      )
          .timeout(
        const Duration(seconds: 3),
        onTimeout: () {
          throw TimeoutException('Connection timeout');
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        final accessToken = data['accessToken'];
        final refreshToken = data['refreshToken'];

        if (accessToken == null || refreshToken == null) {
          emit(LoginFailure("Invalid response from server"));
          return;
        }

        // Step 2: Decode JWT and validate role
        final decodedToken = _decodeJWT(accessToken);
        final role = decodedToken['role']?.toString().toUpperCase();

        // Step 3: Quick role validation
        if (role == null) {
          emit(LoginFailure("Invalid token: role not found"));
          return;
        }

        if (role != 'TEACHER') {
          emit(LoginFailure("Access denied. This app is only for teachers."));
          return;
        }

        // Step 4: Extract expiry from JWT or use default
        final expirySeconds = data['expiresIn'] ?? _extractExpiryFromJWT(accessToken);

        // Step 5: Save tokens with expiry
        try {
          await Future.wait([
            SecureTokenStorage.saveTokens(
              accessToken,
              refreshToken,
              expirySeconds: expirySeconds,
            ),
            SecureTokenStorage.saveRole(role),
          ]);

          emit(LoginSuccess("Welcome, Teacher!"));
        } catch (e) {
          emit(LoginFailure("Failed to save login credentials"));
        }
      } else {
        // Handle different error status codes
        try {
          final data = jsonDecode(response.body);
          String errorMessage = data['message'] ?? "Invalid email or password";
          emit(LoginFailure(errorMessage));
        } catch (e) {
          emit(LoginFailure("Invalid email or password"));
        }
      }
    } on TimeoutException catch (_) {
      emit(LoginFailure("Connection timeout. Please try again."));
    } on http.ClientException catch (_) {
      emit(LoginFailure("Network error. Please check your connection."));
    } on FormatException catch (_) {
      emit(LoginFailure("Invalid server response"));
    } catch (e) {
      emit(LoginFailure("Unable to connect to server"));
    }
  }

  @override
  Future<void> close() {
    _client.close(); // Clean up HTTP client
    return super.close();
  }
}