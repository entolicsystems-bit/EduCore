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
  return API.put(`/v1/leads/${id}`, data);
};

// DELETE LEAD
export const deleteLead = (id) => {
  return API.delete(`/v1/leads/${id}`);
};

// GET LEAD BY ID
export const getLeadById = (id) => {
  return API.get(`/v1/leads/${id}`);
};
