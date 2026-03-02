import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/ApiService";
import { handleApiResponse } from "./HandleResponse";
import type { BlogsParams, Blog, BlogMeta } from "../services/ApiService";

export const useGetModels = (brandName: string) => {
  return useQuery({
    queryKey: ["models", brandName],
    queryFn: async () => {
      const response = await ApiService.getInstance().getModels(brandName);
      const { data } = response;
      return handleApiResponse(data);
    },
    enabled: !!brandName,
  });
};

export const useGetMyOrders = (token: string | null) => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      const response = await ApiService.getInstance().getMyOrders(token);
      return handleApiResponse(response.data);
    },
    enabled: !!token,
  });
};

export const useGetBlogs = (params: BlogsParams) => {
  return useQuery({
    queryKey: ["blogs", params.page, params.limit, params.published],
    queryFn: async () => {
      const response = await ApiService.getInstance().getBlogs(params);
      const result = handleApiResponse(response.data);
      return result.data as { blogs: Blog[]; meta: BlogMeta };
    },
  });
};
