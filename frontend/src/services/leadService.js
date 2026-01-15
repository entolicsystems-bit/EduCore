import axios from "axios";
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
// export const updateLead = async (id, data) => {
//   // console.log(id, data);

//   return await axios.patch(`http://3.7.212.22:3000/api/v1/leads/${id}`, data);
// };

export const updateLead = async (id, data) => {
  return axios.patch(`http://3.7.212.22:3000/v1/leads/${id}`, data);
};

// DELETE LEAD
export const deleteLead = (id) => {
  return API.delete(`/v1/leads/${id}`);
};

// IMPORT LEADS CSV
export const importLeadsCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);

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
export const getLimitedLead = (params) => {
  return API.get("/v1/leads", { params });
};

// Filter Leads
// export const getFilterLeads = (filters = {}) => {
//   return API.get("/v1/leads", {
//     params: filters,
//   });
// };
