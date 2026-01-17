import 'package:equatable/equatable.dart';

class LoginState extends Equatable {
  final String email;
  final String password;
  final bool isPasswordVisible;
  final bool isLoading;
  final bool isSuccess;
  final String? errorMessage;
  final bool isAuthenticated;
  final String? accessToken;
  final String? refreshToken;
  final String? userRole; // Added: STUDENT or PARENT

  const LoginState({
    this.email = '',
    this.password = '',
    this.isPasswordVisible = false,
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMessage,
    this.isAuthenticated = false,
    this.accessToken,
    this.refreshToken,
    this.userRole,
  });

  // Helper getters
  bool get isStudent => userRole?.toUpperCase() == 'STUDENT';
  bool get isParent => userRole?.toUpperCase() == 'PARENT';

  LoginState copyWith({
    String? email,
    String? password,
    bool? isPasswordVisible,
    bool? isLoading,
    bool? isSuccess,
    String? errorMessage,
    bool? isAuthenticated,
    String? accessToken,
    String? refreshToken,
    String? userRole,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      isPasswordVisible: isPasswordVisible ?? this.isPasswordVisible,
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMessage: errorMessage,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      userRole: userRole ?? this.userRole,
    );
  }
  // login state

  @override
  List<Object?> get props => [
    email,
    password,
    isPasswordVisible,
    isLoading,
    isSuccess,
    errorMessage,
    isAuthenticated,
    accessToken,
    refreshToken,
    userRole,
  ];
}