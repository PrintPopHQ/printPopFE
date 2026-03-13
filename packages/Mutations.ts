import { useMutation } from "@tanstack/react-query";
import {
  ApiService,
  SignInPayload,
  SignUpPayload,
  CreateOrderPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  ContactPayload,
  UpdateProfilePayload,
} from "../services/ApiService";
import { handleApiResponse } from "./HandleResponse";
import { saveUser } from "../lib/auth-store";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const response = await ApiService.getInstance().signUp(payload);
      return handleApiResponse(response.data);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ payload, token }: { payload: ChangePasswordPayload; token: string }) => {
      const response = await ApiService.getInstance().changePassword(payload, token);
      return response.data; // Don't use handleApiResponse if we want direct raw data or if handleApiResponse throws
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

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await ApiService.getInstance().forgotPassword(payload);
      return handleApiResponse(response.data);
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await ApiService.getInstance().resetPassword(payload);
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

interface CheckoutItem {
  id: string;
  image: string; // full canvas mockup with phone frame (→ customimage in API)
  customImage: string; // artwork only: user images + text, no phone frame (→ designimage in API)
  phoneModelId: string;
  caseType: string;
  quantity: number;
  guestEmail?: string;
  userEmail?: string;
}

interface CheckoutPayload {
  cartItems: CheckoutItem[];
  email: string;
  accessToken?: string;
}

/** Uploads all cart-item images in parallel, then creates the order in one shot. */
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: async ({ cartItems, email, accessToken }: CheckoutPayload) => {
      // 1. Upload both images (custom & design) for each item
      const itemImages = await Promise.all(
        cartItems.map(async (item) => {
          // Upload design image (canvas export)
          const designRes = await fetch(item.image);
          const designBlob = await designRes.blob();
          const designFile = new File([designBlob], `${item.id}_design.png`, { type: "image/png" });
          const designUploadRes = await ApiService.getInstance().uploadImage(designFile);
          const designUrl = handleApiResponse(designUploadRes.data).data.url;

          // Upload custom image (user upload) if it exists
          let customUrl = "";
          if (item.customImage) {
            const customRes = await fetch(item.customImage);
            const customBlob = await customRes.blob();
            const customFile = new File([customBlob], `${item.id}_custom.png`, { type: "image/png" });
            const customUploadRes = await ApiService.getInstance().uploadImage(customFile);
            customUrl = handleApiResponse(customUploadRes.data).data.url;
          }

          return { designUrl, customUrl };
        })
      );

      // 2. Create order
      const orderPayload: CreateOrderPayload = {
        items: cartItems.map((item, idx) => ({
          modelid: item.phoneModelId,
          customimage: itemImages[idx].designUrl,
          designimage: itemImages[idx].customUrl,
          quantity: item.quantity,
          material: item.caseType,
        })),
        email,
      };

      const orderRes = await ApiService.getInstance().createOrder(orderPayload, accessToken);
      const orderResult = handleApiResponse(orderRes.data);
      return orderResult.data as { checkoutUrl: string };
    },
  });
};
export const useContactMutation = () => {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const response = await ApiService.getInstance().contact(payload);
      return handleApiResponse(response.data);
    },
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async ({
      payload,
      token,
    }: {
      payload: UpdateProfilePayload;
      token: string;
    }) => {
      const response = await ApiService.getInstance().updateProfile(payload, token);
      const result = handleApiResponse(response.data);
      // Sync updated user data back to local auth store
      if (result?.data) {
        saveUser(result.data);
      }
      return result;
    },
  });
};
