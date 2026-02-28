import { useMutation } from "@tanstack/react-query";
import { ApiService, SignInPayload, SignUpPayload } from "../services/ApiService";
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