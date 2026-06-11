import axiosInstance from "@/services/axios";

export const refreshTokenApi = async (payload) => {
  const response = await axiosInstance.post(
    "/auth/refreshtoken",
    payload
  );

  return response.data;
};