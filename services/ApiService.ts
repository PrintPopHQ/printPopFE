import axios, { AxiosInstance } from "axios";
import { ENV } from "./env";

const ENDPOINTS = {
  GET_MODELS: "/models",
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  VERIFY_EMAIL: "/auth/verify-email",
};

export interface SignUpPayload {
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
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
}
