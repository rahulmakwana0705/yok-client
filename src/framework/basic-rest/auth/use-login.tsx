import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
// import { useMutation } from "@tanstack/react-query";
import { useMutation, DefaultError } from "@tanstack/react-query";

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function login(input: LoginInputType) {
  return http.post(API_ENDPOINTS.LOGIN, input);
  // return {
  //   token: `${input.email}.${input.remember_me}`.split('').reverse().join(''),
  // };
}

export const useLoginMutation = (
  onErrorCallback: (error: DefaultError) => void
) => {
  const { authorize, closeModal } = useUI();
  return useMutation({
    mutationFn: (input: LoginInputType) => login(input),
    onSuccess: (data) => {
      console.log("data login", data);

      Cookies.set("auth_token", data.data.token);
      Cookies.set("token", JSON.stringify(data.data.user));
      authorize();
      closeModal();
      window.location.reload();
    },
    onError: (error: DefaultError) => {
      console.error("Login error:", error);
      onErrorCallback(error);
    },
  });
};
