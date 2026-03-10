import axios from "axios";

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    { email, password }
  );

  return data.user || data;
};