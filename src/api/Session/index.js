import api from "../config";

export const GetConnectCards = async (data) => {
  const response = await api();

  return response.post("/contributions/connect/start", { ...data });
};

export const GetScriptCards = async (data) => {
  const response = await api();

  return response.post("/contributions/script/start", { ...data });
};

export const GetCards = async (data) => {
  const response = await api();

  return response.post("/contributions/start", { ...data });
};

export const SearchEntity = async (params) => {
  const response = await api();

  return response.get(
    `/entities?page=${params?.page}&limit=${params?.limit}&search=${params?.keyword}`
  );
};

export const GetRecommendations = async (params) => {
  const response = await api();

  return response.get(
    `/entities/recommendations?page=${params?.page}&limit=${params?.limit}&search=${params?.keyword}`
  );
};

export const GetConnectDetail = async ({ contributionId, id }) => {
  const response = await api();
  return response.get(`/contributions/${contributionId}/connect/${id}`);
};

export const GetScriptDetail = async ({ contributionId, id }) => {
  const response = await api();
  return response.get(`/contributions/${contributionId}/script/${id}`);
};

export const GetHyphenationDetail = async ({ contributionId, id }) => {
  const response = await api();
  return response.get(`/contributions/${contributionId}/hyphenation/${id}`);
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
  return response.get(`/entities/${entityId}`);
};

export const UpdateConnectCardDetail = async ({ data, contributionId, id }) => {
  const response = await api();
  return response.put(`/contributions/${contributionId}/connect/${id}`, {
    ...data,
  });
};

export const UpdateScriptCardDetail = async ({ data, contributionId, id }) => {
  const response = await api();
  return response.put(`/contributions/${contributionId}/script/${id}`, {
    ...data,
  });
};

export const UpdateHyphenationCardDetail = async ({
  data,
  contributionId,
  id,
}) => {
  const response = await api();
  return response.put(`/contributions/${contributionId}/hyphenation/${id}`, {
    ...data,
  });
};

export const EndContribution = async () => {
  const response = await api();
  return response.post(`/contributions/end`);
};

export const GetLanguages = async () => {
  const response = await api();
  return response.get("/wikidata/languages");
};
