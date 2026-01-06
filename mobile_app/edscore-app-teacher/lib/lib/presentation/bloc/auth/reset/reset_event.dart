abstract class ResetPasswordEvent {}

class ResetPasswordSubmitted extends ResetPasswordEvent {
  final String email;
  final String newPassword;
  final String confirmPassword;

  ResetPasswordSubmitted({
    required this.email,
    required this.newPassword,
    required this.confirmPassword,
  });
}