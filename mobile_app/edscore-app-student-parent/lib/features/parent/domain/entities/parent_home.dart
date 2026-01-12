// lib/features/parent/domain/entities/parent_home.dart

class StudentInfo {
  final String id;
  final String name;
  final String grade;
  final String enrollmentStatus;
  final String? profileImage;

  StudentInfo({
    required this.id,
    required this.name,
    required this.grade,
    required this.enrollmentStatus,
    this.profileImage,
  });
}

class ParentHomeData {
  final String parentName;
  final List<StudentInfo> students;

  ParentHomeData({
    required this.parentName,
    required this.students,
  });
}