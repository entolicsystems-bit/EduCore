abstract class StudentProfileEvent {}

class FetchStudentProfile extends StudentProfileEvent {
  final String studentId;
  final String token;

  FetchStudentProfile({
    required this.studentId,
    required this.token,
  });
}
