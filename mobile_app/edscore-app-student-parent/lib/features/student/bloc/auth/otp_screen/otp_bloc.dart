import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'otp_event.dart';
import 'otp_state.dart';

class OtpBloc extends Bloc<OtpEvent, OtpState> {
  Timer? _expiryTimer;
  static const int otpExpirySeconds = 30;

  OtpBloc() : super(OtpInitial()) {
    _startExpiryTimer();

    on<OtpSubmitted>(_onOtpSubmitted);
    on<OtpResendRequested>(_onOtpResend);
    on<OtpExpired>(_onOtpExpired);
  }

  void _startExpiryTimer() {
    _expiryTimer?.cancel();
    _expiryTimer =
        Timer(const Duration(seconds: otpExpirySeconds), () {
          add(OtpExpired());
        });
  }

  Future<void> _onOtpSubmitted(
      OtpSubmitted event, Emitter<OtpState> emit) async {
    emit(OtpLoading());
    await Future.delayed(const Duration(seconds: 1));

    if (state is OtpExpiredState) {
      emit(OtpFailure('OTP expired. Please resend OTP.'));
      return;
    }

    if (event.otp == '1234') {
      _expiryTimer?.cancel();
      emit(OtpVerified());
    } else {
      emit(OtpFailure('Invalid OTP'));
    }
  }

  void _onOtpResend(
      OtpResendRequested event, Emitter<OtpState> emit) {
    _startExpiryTimer();
    emit(OtpResent());
  }

  void _onOtpExpired(OtpExpired event, Emitter<OtpState> emit) {
    emit(OtpExpiredState());
  }

  @override
  Future<void> close() {
    _expiryTimer?.cancel();
    return super.close();
  }
}
//