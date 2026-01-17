import API from "./api";

// Create DRAFT application
export const createApplication = async (leadId, programId, formData) => {
  const res = await API.post("/v1/applications/create", {
    leadId,
    programId,
    formData,
  });
  return res.data.data;
};

// Save draft (overwrite formData)
export const saveApplicationDraft = async (applicationId, formData) => {
  const res = await API.post(`/v1/applications/${applicationId}`, {
    formData,
  });
  return res.data;
};

// Submit final application
export const submitApplication = async (applicationId) => {
  const res = await API.post(`/v1/applications/${applicationId}/submit`);
  return res.data;
};

// upload document file
    export const uploadDocument = async (applicationId, File, fieldName) => {
        const formData = new FormData();
        formData.append("file", File);
        formData.append("fieldName", fieldName);
        
        const res = await API.post(
            `/v1/applications/${applicationId}/upload-document`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        return res.data;
    }