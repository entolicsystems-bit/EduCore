import '../domain/entities/student.dart';


abstract class StudentState {}

class StudentInitial extends StudentState {}

class StudentLoading extends StudentState {}

class StudentLoaded extends StudentState {
  final List<Student> students;

  StudentLoaded({required this.students});
}

class StudentError extends StudentState {
  final String message;

  StudentError({required this.message});
}
//
