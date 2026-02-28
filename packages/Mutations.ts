import { useMutation } from "@tanstack/react-query";
import { ApiService, SignInPayload, SignUpPayload, CreateOrderPayload } from "../services/ApiService";
import { handleApiResponse } from "./HandleResponse";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const response = await ApiService.getInstance().signUp(payload);
      return handleApiResponse(response.data);
    },
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const response = await ApiService.getInstance().signIn(payload);
      return handleApiResponse(response.data);
    },
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await ApiService.getInstance().verifyEmail(token);
      return handleApiResponse(response.data);
    },
  });
};

/** Converts a base64 data-URL to a File and uploads it, returning the CDN URL. */
export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (dataUrl: string): Promise<string> => {
      // Convert data-URL → Blob → File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "design.png", { type: "image/png" });
      const response = await ApiService.getInstance().uploadImage(file);
      const result = handleApiResponse(response.data);
      return result.data.url as string;
    },
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await ApiService.getInstance().createOrder(payload);
      return handleApiResponse(response.data);
    },
  });
};