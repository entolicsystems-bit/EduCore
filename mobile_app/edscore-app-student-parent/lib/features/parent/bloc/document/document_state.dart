class DocumentState {
  final String? birthFileName;
  final String? medicalFileName;
  final String? marksheetFileName;

  final String birthStatus;
  final String medicalStatus;
  final String marksheetStatus;

  final bool isDownloading;
  DocumentState({
    this.birthFileName,
    this.medicalFileName,
    this.marksheetFileName,
    this.birthStatus = "Pending",
    this.medicalStatus = "Pending",
    this.marksheetStatus = "Pending",
    this.isDownloading = false,
  });
//
  DocumentState copyWith({
    String? birthFileName,
    String? medicalFileName,
    String? marksheetFileName,
    String? birthStatus,
    String? medicalStatus,
    String? marksheetStatus,
    bool? isDownloading,
  }) {
    return DocumentState(
      birthFileName: birthFileName ?? this.birthFileName,
      medicalFileName: medicalFileName ?? this.medicalFileName,
      marksheetFileName: marksheetFileName ?? this.marksheetFileName,
      birthStatus: birthStatus ?? this.birthStatus,
      medicalStatus: medicalStatus ?? this.medicalStatus,
      marksheetStatus: marksheetStatus ?? this.marksheetStatus,
      isDownloading: isDownloading ?? this.isDownloading,
    );
  }
}
