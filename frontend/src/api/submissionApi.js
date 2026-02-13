import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export const submitFormRequest = async (payload) => {
  return axios.post(`${API_BASE}/submit`, payload);
};

export const markSubmissionFailed = async (idempotencyKey) => {
  return axios.patch(`${API_BASE}/submit/fail`, {
    idempotencyKey,
  });
};
