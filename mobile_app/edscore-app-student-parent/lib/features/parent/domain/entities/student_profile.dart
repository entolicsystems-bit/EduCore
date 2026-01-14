// lib/features/parent/domain/entities/student_profile.dart

class StudentProfile {
  final String id;
  final String name;
  final String grade;
  final String enrollmentStatus;
  final String? profileImage;
  final PersonalInformation? personalInfo;
  final GuardianInformation? guardianInfo;
  final AcademicSummary? academicSummary;

  StudentProfile({
    required this.id,
    required this.name,
    required this.grade,
    required this.enrollmentStatus,
    this.profileImage,
    this.personalInfo,
    this.guardianInfo,
    this.academicSummary,
  });
}

class PersonalInformation {
  final String dateOfBirth;
  final String gender;
  final String bloodGroup;
  final String address;
  final String phone;
  final String email;

  PersonalInformation({
    required this.dateOfBirth,
    required this.gender,
    required this.bloodGroup,
    required this.address,
    required this.phone,
    required this.email,
  });
}

class GuardianInformation {
  final String fatherName;
  final String fatherOccupation;
  final String fatherPhone;
  final String motherName;
  final String motherOccupation;
  final String motherPhone;

  GuardianInformation({
    required this.fatherName,
    required this.fatherOccupation,
    required this.fatherPhone,
    required this.motherName,
    required this.motherOccupation,
    required this.motherPhone,
  });
}

class AcademicSummary {
  final double attendance;
  final double cgpa;
  final int totalSubjects;
  final String academicYear;

  AcademicSummary({
    required this.attendance,
    required this.cgpa,
    required this.totalSubjects,
    required this.academicYear,
  });
}