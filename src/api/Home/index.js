import api from "../config";

export const GetProfile = async (input) => {
  const response = await api();

  return response.get("/users/profile");
};

export const GetLexemeLanguage = async (data) => {
  const response = await api();

  return response.get(`/languages?search=${data?.search || ""}`);
};

export const GetActivities = async (data) => {
  const response = await api();

  return response.get(
    `/activities?search=${data?.search || ""}&languageId=${data?.id}`
  );
};

export const updateUserPreference = async (data) => {
  const response = await api();

  return response.put("/users/preference", { ...data });
};
