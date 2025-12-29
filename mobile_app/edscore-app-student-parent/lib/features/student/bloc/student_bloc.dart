import 'package:flutter_bloc/flutter_bloc.dart';

import '../domain/entities/student.dart';
import 'student_event.dart';
import 'student_state.dart';


class StudentBloc extends Bloc<StudentEvent, StudentState> {
  StudentBloc() : super(StudentInitial()) {
    on<LoadStudents>(_onLoadStudents);
  }

  Future<void> _onLoadStudents(
      LoadStudents event,
      Emitter<StudentState> emit,
      ) async {
    emit(StudentLoading());

    try {
      await Future.delayed(const Duration(seconds: 2));

      // Dummy data
      final students = [
        Student(id: '1', name: 'Rahul', rollNo: '101'),
        Student(id: '2', name: 'Sneha', rollNo: '102'),
        Student(id: '3', name: 'Amit', rollNo: '103'),
      ];

      emit(StudentLoaded(students: students));
    } catch (e) {
      emit(StudentError(message: 'Failed to load students'));
    }
  }
}
