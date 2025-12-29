abstract class OtpState {}

class OtpInitial extends OtpState {}

class OtpLoading extends OtpState {}

class OtpVerified extends OtpState {}

class OtpFailure extends OtpState {
  final String error;
  OtpFailure(this.error);
}

class OtpResent extends OtpState {}

class OtpExpiredState extends OtpState {}
