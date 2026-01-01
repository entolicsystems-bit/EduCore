// import 'dart:convert';
//
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:http/http.dart' as http;
//
//
//
// abstract class LoginEvent {}
//
// class LoginSubmitted extends LoginEvent {
//   final String email;
//   final String password;
//
//   LoginSubmitted({required this.email, required this.password});
// }
//
// abstract class LoginState {}
//
// class LoginInitial extends LoginState {}
//
// class LoginLoading extends LoginState {}
//
// class LoginSuccess extends LoginState {
//   final String message;
//   LoginSuccess(this.message);
// }
//
// class LoginFailure extends LoginState {
//   final String error;
//   LoginFailure(this.error);
// }
//
// class LoginBloc extends Bloc<LoginEvent, LoginState> {
//   LoginBloc() : super(LoginInitial()) {
//     on<LoginSubmitted>(_onLoginSubmitted);
//   }
//
//   Future<void> _onLoginSubmitted(
//       LoginSubmitted event,
//       Emitter<LoginState> emit,
//       ) async {
//     emit(LoginLoading());
//
//     Map<String, dynamic> body = {
//       "email": event.email,
//       "password": event.password,
//     };
//
//     try {
//       final response = await http.post(
//         Uri.parse("http://3.7.212.22:3000/v1/auth/login"),
//         headers: {"Content-Type": "application/json"},
//         body: jsonEncode(body),
//       );
//
//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         emit(LoginSuccess(data['message'] ?? 'Login successful'));
//       } else {
//         final data = jsonDecode(response.body);
//         emit(LoginFailure(data['message'] ?? 'Invalid email or password'));
//       }
//     } catch (e) {
//       emit(LoginFailure("Unable to connect to server"));
//     }
//   }
//
// }
//
//
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