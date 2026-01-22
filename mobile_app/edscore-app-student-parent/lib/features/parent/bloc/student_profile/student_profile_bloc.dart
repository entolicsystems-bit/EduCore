import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repository/student_repository.dart';
import 'student_profile_event.dart';
import 'student_profile_state.dart';

class StudentProfileBloc extends Bloc<StudentProfileEvent, StudentProfileState> {
  final StudentRepository repository;

  StudentProfileBloc(this.repository) : super(StudentProfileState()) {
    on<FetchStudentProfile>(_onFetchStudentProfile);
  }

  Future<void> _onFetchStudentProfile(
      FetchStudentProfile event,
      Emitter<StudentProfileState> emit,
      ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      final profile = await repository.fetchStudentProfile(
        studentId: event.studentId,
        token: event.token,
      );

      emit(state.copyWith(
        isLoading: false,
        profile: profile,
        clearError: true,
      ));
    } on UnauthorizedException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.message,
        isSessionExpired: true,
      ));
    } on NetworkException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.message,
      ));
    } on NotFoundException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.message,
      ));
    } on ServerException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.message,
      ));
    } on DataParseException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: 'Invalid data received from server',
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      ));
    }
  }
}