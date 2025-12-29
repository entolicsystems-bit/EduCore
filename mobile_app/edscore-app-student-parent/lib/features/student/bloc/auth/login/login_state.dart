import 'package:equatable/equatable.dart';

class AuthState extends Equatable {
  final bool isStudent;
  final String email;
  final String password;
  final bool isPasswordVisible;
  final bool isLoading;
  final bool isSuccess;
  final String? errorMessage;

  const AuthState({
    this.isStudent = true,
    this.email = '',
    this.password = '',
    this.isPasswordVisible = false,
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isStudent,
    String? email,
    String? password,
    bool? isPasswordVisible,
    bool? isLoading,
    bool? isSuccess, // ✅ ADD THIS
    String? errorMessage,
  }) {
    return AuthState(
      isStudent: isStudent ?? this.isStudent,
      email: email ?? this.email,
      password: password ?? this.password,
      isPasswordVisible:
      isPasswordVisible ?? this.isPasswordVisible,
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [
    isStudent,
    email,
    password,
    isPasswordVisible,
    isLoading,
    isSuccess, // ✅ ADD THIS
    errorMessage,
  ];
}
