import axios, { AxiosInstance } from "axios";
import { ENV } from "./env";

const ENDPOINTS = {
  GET_MODELS: "/models",
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  VERIFY_EMAIL: "/auth/verify-email",
  UPLOAD_IMAGE: "/r2/upload",
  CREATE_ORDER: "/orders/create-order",
};

export interface SignUpPayload {
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface OrderItem {
  modelid: string;
  customimage: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  email: string;
}

export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: ENV.API_URL,
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public getModels(brandName: string) {
    return this.axiosInstance.get(`${ENDPOINTS.GET_MODELS}/${brandName}`);
  }

  public signUp(payload: SignUpPayload) {
    return this.axiosInstance.post(ENDPOINTS.SIGNUP, payload);
  }

  public signIn(payload: SignInPayload) {
    return this.axiosInstance.post(ENDPOINTS.LOGIN, payload);
  }

  public verifyEmail(token: string) {
    return this.axiosInstance.get(ENDPOINTS.VERIFY_EMAIL, {
      params: { token },
    });
  }

  /** Upload a single image (base64 data-URL converted to a File blob). */
  public uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    return this.axiosInstance.post(ENDPOINTS.UPLOAD_IMAGE, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  public createOrder(payload: CreateOrderPayload) {
    return this.axiosInstance.post(ENDPOINTS.CREATE_ORDER, payload);
  }
}
