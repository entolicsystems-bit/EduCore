enum DocumentStatus { verified, uploaded, pending }

DocumentStatus getStatus(String status) {
  switch (status) {
    case "verified":
      return DocumentStatus.verified;
    case "uploaded":
      return DocumentStatus.uploaded;
    default:
      return DocumentStatus.pending;
  }
}
