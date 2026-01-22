class StudentProfile {
  final String id;
  final String fullName;
  final String dob;
  final String gender;
  final String bloodGroup;
  final String address;
  final String grade;
  final String section;
  final String rollNumber;
  final String admissionDate;
  final String status;
  final Guardian father;
  final Guardian mother;

  StudentProfile({
    required this.id,
    required this.fullName,
    required this.dob,
    required this.gender,
    required this.bloodGroup,
    required this.address,
    required this.grade,
    required this.section,
    required this.rollNumber,
    required this.admissionDate,
    required this.status,
    required this.father,
    required this.mother,
  });

  factory StudentProfile.fromJson(Map<String, dynamic> json) {
    return StudentProfile(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? '',
      dob: json['dob']?.toString() ?? 'N/A',
      gender: json['gender']?.toString() ?? 'N/A',
      bloodGroup: json['bloodGroup']?.toString() ?? 'N/A',
      address: json['address']?.toString() ?? 'N/A',
      grade: json['grade']?.toString() ?? 'N/A',
      section: json['section']?.toString() ?? 'N/A',
      rollNumber: json['rollNumber']?.toString() ?? 'N/A',
      admissionDate: json['admissionDate']?.toString() ?? 'N/A',
      status: json['status']?.toString() ?? 'Unknown',
      father: json['father'] != null
          ? Guardian.fromJson(json['father'])
          : Guardian.empty(),
      mother: json['mother'] != null
          ? Guardian.fromJson(json['mother'])
          : Guardian.empty(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'dob': dob,
      'gender': gender,
      'bloodGroup': bloodGroup,
      'address': address,
      'grade': grade,
      'section': section,
      'rollNumber': rollNumber,
      'admissionDate': admissionDate,
      'status': status,
      'father': father.toJson(),
      'mother': mother.toJson(),
    };
  }
}

class Guardian {
  final String name;
  final String phone;
  final String email;

  Guardian({
    required this.name,
    required this.phone,
    required this.email,
  });

  factory Guardian.fromJson(Map<String, dynamic> json) {
    return Guardian(
      name: json['name']?.toString() ?? 'N/A',
      phone: json['phone']?.toString() ?? 'N/A',
      email: json['email']?.toString() ?? 'N/A',
    );
  }

  factory Guardian.empty() {
    return Guardian(
      name: 'N/A',
      phone: 'N/A',
      email: 'N/A',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone': phone,
      'email': email,
    };
  }
}