// abstract class LoginState {}
//
// class LoginInitial extends LoginState {}
//
// class LoginLoading extends LoginState {}
//
//
//
// class LoginSuccess extends LoginState {
//   final String message;
//   LoginSuccess({this.message = 'Login successful!'});
// }
//
// class LoginFailure extends LoginState {
//   final String error;
//   LoginFailure(this.error);
// }
//
// class LoginValidating extends LoginState {
//   final String? emailError;
//   final String? passwordError;
//
//   LoginValidating({this.emailError, this.passwordError});
// }


abstract class LoginState {}

class LoginInitial extends LoginState {}

class LoginLoading extends LoginState {}

class LoginSuccess extends LoginState {
  final String message;
  LoginSuccess(this.message);
}

class LoginFailure extends LoginState {
  final String error;
  LoginFailure(this.error);
}
