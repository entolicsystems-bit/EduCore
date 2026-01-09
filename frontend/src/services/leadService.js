import API from "./api";

// GET ALL / SEARCH / FILTER LEADS
export const getLeads = (params = {}) => {
  return API.get("/v1/leads", { params });
};

// CREATE LEAD
export const createLead = (data) => {
  return API.post("/v1/leads/create", data);
};

// UPDATE LEAD
export const updateLead = (id, data) => {
  return API.patch(`/v1/leads/${id}`, data);
};

// DELETE LEAD
export const deleteLead = (id) => {
  return API.delete(`/v1/leads/${id}`);
};

// IMPORT LEADS CSV
export const importLeadsCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file); // backend expects key "file"

  return API.post("/v1/csv/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET LEAD BY ID
export const getLeadById = (id) => {
  return API.get(`/v1/leads/${id}`);
};
//limited leads
export const getLimitedLead = (params = {}) => {
  return API.get("/v1/leads?page=1&limit=8", { params });
};
