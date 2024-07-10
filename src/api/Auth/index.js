import api from "../config";

export const Login = async (input) => {
  const response = await api();

  return response.post("/auth/access-token", input);
};
