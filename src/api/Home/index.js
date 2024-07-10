import api from "../config";

export const GetProfile = async (input) => {
  const response = await api();

  return response.get("/auth/profile");
};
