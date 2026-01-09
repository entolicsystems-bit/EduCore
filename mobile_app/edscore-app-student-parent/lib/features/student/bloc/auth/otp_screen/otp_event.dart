abstract class OtpEvent {}

class OtpSubmitted extends OtpEvent {
  final String otp;
  final String email;

  OtpSubmitted({required this.otp, required this.email});
}

class OtpResendRequested extends OtpEvent {
  final String email;
  OtpResendRequested(this.email);
}

class OtpExpired extends OtpEvent {}
//