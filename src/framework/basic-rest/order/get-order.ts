import { Order } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchOrder = async (_id: string) => {
  const { data: { order } } = await http.get(API_ENDPOINTS.GET_ORDER(_id));

  console.log(order)
  return order;
};
export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: [API_ENDPOINTS.GET_ORDER, id],
    queryFn: () => fetchOrder(id)
  });
};
