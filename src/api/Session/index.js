import api from "../config";

export const GetConnectCards = async (data) => {
  const response = await api();

  return response.post("/contributions/connect/start", { ...data });
};

export const GetScriptCards = async (data) => {
  const response = await api();

  return response.post("/contributions/script/start", { ...data });
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

export const GetLexemeDetail = async (lexemeId) => {
  const response = await api();
  return response.get(`/lexemes/${lexemeId}`);
};

export const GetEntityDetail = async (entityId) => {
  const response = await api();
  return response.get(`/entites/${entityId}`);
};

export const UpdateConnectCardDetail = async (data) => {
  const response = await api();
  return response.put(`/contributions/connect/${data.contributionDetailId}`, {
    ...data,
  });
};

export const UpdateScriptCardDetail = async (data) => {
  const response = await api();
  return response.put(`/contributions/script/${data.contributionDetailId}`, {
    ...data,
  });
};

export const EndContribution = async () => {
  const response = await api();
  return response.post(`/contributions/end`);
};
