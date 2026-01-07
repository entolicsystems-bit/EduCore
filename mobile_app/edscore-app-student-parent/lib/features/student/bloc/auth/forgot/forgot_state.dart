abstract class ForgotPasswordState {}

class ForgotPasswordInitial extends ForgotPasswordState {}

class ForgotPasswordLoading extends ForgotPasswordState {}

class ForgotPasswordSuccess extends ForgotPasswordState {
  final String email;
  ForgotPasswordSuccess(this.email);
}

class ForgotPasswordFailure extends ForgotPasswordState {
  final String error;
  ForgotPasswordFailure(this.error);
}

class ForgotPasswordValidating extends ForgotPasswordState {
  final String? emailError;
  ForgotPasswordValidating({this.emailError});
}
// forgot state