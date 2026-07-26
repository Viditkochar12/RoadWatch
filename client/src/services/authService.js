import api from "./api";

const API_URL = "/auth";

export const loginUser = async (email, password) => {
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });

  return response.data;
};

export const getProfile = async (token) => {
  const response = await api.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};