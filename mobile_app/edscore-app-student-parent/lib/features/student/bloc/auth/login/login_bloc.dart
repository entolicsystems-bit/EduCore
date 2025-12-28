import 'package:flutter_bloc/flutter_bloc.dart';
import 'login_event.dart';
import 'login_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(const AuthState()) {

    on<ToggleUserType>((event, emit) {
      emit(
        state.copyWith(
          isStudent: !state.isStudent,
          errorMessage: null,
        ),
      );
    });


    on<EmailChanged>((event, emit) {
      emit(state.copyWith(email: event.email, errorMessage: null));
    });


    on<PasswordChanged>((event, emit) {
      emit(state.copyWith(password: event.password, errorMessage: null));
    });


    on<TogglePasswordVisibility>((event, emit) {
      emit(state.copyWith(isPasswordVisible: !state.isPasswordVisible));
    });


    on<LoginSubmitted>((event, emit) async {

      if (state.email.isEmpty || state.password.isEmpty) {
        emit(state.copyWith(errorMessage: 'Please fill in all fields'));
        return;
      }

      emit(state.copyWith(isLoading: true, errorMessage: null));

      await Future.delayed(Duration(seconds: 1));


      const studentEmail = 'student@test.com';
      const studentPassword = '123456';

      const parentEmail = 'parent@test.com';
      const parentPassword = '123456';


      bool isValid = false;

      if (state.isStudent) {

        isValid = state.email == studentEmail &&
            state.password == studentPassword;
      } else {

        isValid = state.email == parentEmail &&
            state.password == parentPassword;
      }

      if (isValid) {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: true,
        ));

        print(
          'Login successful as ${state.isStudent ? "Student" : "Parent"}',
        );
      } else {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid email or password',
        ));
      }
    });
  }
}
