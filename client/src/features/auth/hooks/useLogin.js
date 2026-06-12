import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginApi } from "../api/loginApi";
import { setUser } from "../authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      const { user, token } = response;

      localStorage.setItem("accessToken", token);

      dispatch(
        setUser({
          user,
          token,
        })
      );

      switch (user.role) {
        case "SUPER_ADMIN":
          navigate("/app/super-admin/dashboard");
          break;

        case "RESTAURANT_OWNER":
          navigate("/app/owner/dashboard");
          break;

        case "OUTLET_MANAGER":
          navigate("/app/outlet/dashboard");
          break;

        case "STAFF":
          navigate("/app/kitchen/dashboard");
          break;

        default:
          navigate("/app/dashboard");
      }
    },

    onError: (error) => {
      console.error(
        "Login Failed:",
        error?.response?.data?.message
      );
    },
  });
};