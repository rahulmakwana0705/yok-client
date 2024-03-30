import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { useMutation } from "@tanstack/react-query";

export interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
  response: object;
}


async function checkout(input: CheckoutInputType) {
  const { data } = await http.post(API_ENDPOINTS.VERIFY_ORDER, input);
  return data

}
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (input: CheckoutInputType) => checkout(input),
    onSuccess: (data) => {
      console.log(data, "Checkout success response");
      alert("payment successful")
    },
    onError: (data) => {
      console.log(data, "Checkout error response");
      alert("payment failed")
    },
  });
};
