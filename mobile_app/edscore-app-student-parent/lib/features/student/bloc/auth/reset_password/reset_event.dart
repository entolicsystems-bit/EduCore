abstract class ResetPasswordEvent {}

class ResetPasswordSubmitted extends ResetPasswordEvent {
  final String newPassword;
  final String confirmPassword;
  final String email;

  ResetPasswordSubmitted({
    required this.newPassword,
    required this.confirmPassword,
    required this.email,
  });
}
//