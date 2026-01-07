abstract class ResetPasswordState {}

class ResetPasswordInitial extends ResetPasswordState {}

class ResetPasswordLoading extends ResetPasswordState {}

class ResetPasswordSuccess extends ResetPasswordState {}

class ResetPasswordFailure extends ResetPasswordState {
  final String error;
  ResetPasswordFailure(this.error);
}

class ResetPasswordValidating extends ResetPasswordState {
  final String? newPasswordError;
  final String? confirmPasswordError;

  ResetPasswordValidating({
    this.newPasswordError,
    this.confirmPasswordError,
  });
}
//