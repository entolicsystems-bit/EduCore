class OfferLetterData {
  final String schoolName;
  final String schoolAddress;
  final String subject;
  final String date;
  final String parentName;
  final String parentAddress;
  final String bodyText;

  OfferLetterData({
    required this.schoolName,
    required this.schoolAddress,
    required this.subject,
    required this.date,
    required this.parentName,
    required this.parentAddress,
    required this.bodyText,
  });

  factory OfferLetterData.fromJson(Map<String, dynamic> json) {
    return OfferLetterData(
        schoolName: json['schoolName'] ?? 'Zp school pune',
        schoolAddress: json['schoolAddress'] ?? 'Chartrapati shivaji maharaj\nchowk, Hinjvadi, pune',
        subject: json['subject'] ?? 'Subject: Admission Offer for Grade 10-A',
        date: json['date'] ?? 'Date: 20 December 2024',
        parentName: json['parentName'] ?? 'Mr. Rajesh Kumar',
        parentAddress: json['parentAddress'] ?? '123, MG Road,\nKorangamala, Bangalore – 560034',
        bodyText: json['bodyText'] ?? 'Dear Mr. Rajesh Kumar,\n\nWe are pleased to inform you that your child, Aarav Kumar, has been selected for admission to Grade 9-A for the academic year 2024–2025 at EntoCrm International School.\n\nThis admission offer is based on Aarav s performance during the admission process and the successful review of the submitted documents.\n\nWe look forward to welcoming Aarav to our school community.',
    );
  }
}