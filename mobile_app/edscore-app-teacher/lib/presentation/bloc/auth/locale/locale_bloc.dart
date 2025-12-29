
import 'dart:ui';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'locale_event.dart';
import 'locale_state.dart';

class LocaleBloc extends Bloc<LocaleEvent, LocaleState> {
  LocaleBloc() : super(LocaleState(const Locale('en'))) {
    on<ChangeLanguage>((event, emit) {
      emit(LocaleState(event.locale));
    });
  }
}















//
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class AuthBloc extends Bloc<AuthEvent,AuthState>{
//   AuthBloc(): super(AuthInitial()) {
//     on<LoginSubmitted>((e, emit) async {
//       emit(AuthLoading());
//       await Future.delayed(const Duration(seconds: 1));
//       emit(AuthSuccess());
//     });
//
//     on<SendOtp>((e,emit)async{
//       emit(AuthLoading());
//       await Future.delayed(const Duration(seconds: 1));
//       emit(AuthOtpsent());
//     });
//     on<VerifyOtp>((e,emit)async{
//       emit(AuthLoading());
//       await Future.delayed(const Duration(seconds: 1));
//       emit(AuthOtpsent());
//     });
//     on<ResetPassword>((e,emit)async{
//       emit(AuthLoading());
//       await Future.delayed(const Duration(seconds: 1));
//       emit(AuthSuccess());
//     });
//   }
// }