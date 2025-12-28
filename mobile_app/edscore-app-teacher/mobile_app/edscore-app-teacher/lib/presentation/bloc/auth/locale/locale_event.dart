import 'dart:ui';

abstract class LocaleEvent {}

class ChangeLanguage extends LocaleEvent {
  final Locale locale;
  ChangeLanguage(this.locale);
}


// import 'package:flutter_bloc/flutter_bloc.dart';
//
//
// abstract class AuthEvent {}
//
// class LoginSubmitted extends AuthEvent{
//   final String email,password;
//
//   LoginSubmitted(this.email,this.password);
// }
//
// class SendOtp extends AuthEvent{
//   final String email;
//   SendOtp(this.email);
// }
//
// class VerifyOtp extends AuthEvent{
//   final String otp;
//   VerifyOtp(this.otp);
// }
//
// class ResetPassword extends AuthEvent{
//   final String password;
//   ResetPassword(this.password);
// }