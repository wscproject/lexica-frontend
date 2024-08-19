import api from "../config";

export const GetProfile = async (input) => {
  const response = await api();

  return response.get("/users/profile");
};

export const GetLexemeLanguage = async () => {
  const response = await api();

  return response.get("/languages");
};

export const updateUserPreference = async (data) => {
  const response = await api();

  return response.put("/users/preference", { ...data });
};
