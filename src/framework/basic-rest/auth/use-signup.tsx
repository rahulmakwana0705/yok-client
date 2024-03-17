import { useUI } from "@contexts/ui.context";
// import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
// import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

export interface SignUpInputType {
  email: string;
  password: string;
  name: string;
}
async function signUp(input: SignUpInputType) {
  // return http.post(API_ENDPOINTS.LOGIN, input);
  return {
    token: `${input.email}.${input.name}`.split("").reverse().join(""),
  };
}
export const useSignUpMutation = () => {
  const { authorize, closeModal } = useUI();

  return useMutation({
    mutationFn: async (input: SignUpInputType) => {
      try {
        const response = await fetch("/api/users/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        return data;
      } catch (error) {
        throw new Error(error.message || "Signup failed");
      }
    },
    onSuccess: (data) => {
      // Assuming your API returns a token upon successful signup
      Cookies.set("auth_token", data.token);

      // Perform other actions upon successful signup
      authorize();
      closeModal();
    },
    onError: (error) => {
      console.error("Signup error:", error.message);
      // Handle the error, e.g., show an error message to the user
      // You can access more detailed error information through the 'error' object
    },
  });
};
