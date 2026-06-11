import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// Fetch profile /me API call
const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

// Hook to fetch and sync current user details
export const useCurrentUserDetails = (options = {}) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Change password mutation call
const changePassword = async (payload) => {
  const response = await axiosInstance.post("/auth/change-password", payload);
  return response.data;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Request Password Reset mutation call
const forgotPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/forgotpassword", payload);
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};
