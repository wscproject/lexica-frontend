import api from "../config";

export const GetCards = async (data) => {
  const response = await api();

  return response.post("/contributions/start", { ...data });
};

export const SearchEntity = async (params) => {
  const response = await api();

  return response.get(
    `/entites?page=${params?.page}&limit=${params?.limit}&search=${params?.keyword}`
  );
};

export const GetCardDetail = async (senseId) => {
  const response = await api();

  return response.get(`/lexemes/sense/${senseId}`);
};

export const GetEntityDetail = async (entityId) => {
  const response = await api();

  return response.get(`/entites/${entityId}`);
};

export const UpdateCardDetail = async (data) => {
  const response = await api();

  return response.put(`/contributions/detail/${data.senseId}`, { ...data });
};

export const EndContribution = async () => {
  const response = await api();

  return response.post(`/contributions/end`);
};
