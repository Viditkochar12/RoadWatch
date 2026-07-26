import api from "./api";

const API_URL = "/reports";

export const getAllReports = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const createReport = async (reportData, token) => {
  const formData = new FormData();

  formData.append("title", reportData.title);
  formData.append("description", reportData.description);
  formData.append("address", reportData.address);
  formData.append("latitude", reportData.latitude);
  formData.append("longitude", reportData.longitude);
  formData.append("severity", reportData.severity);

  if (reportData.image) {
    formData.append("image", reportData.image);
  }

  const response = await api.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyReports = async (token) => {
  const response = await api.get(`${API_URL}/my-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateReportStatus = async (
  reportId,
  status,
  token
) => {
  const response = await api.patch(
    `${API_URL}/${reportId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};