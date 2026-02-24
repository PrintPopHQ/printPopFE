import axios, { AxiosInstance } from "axios";
import { ENV } from "./env";

const ENDPOINTS = {
  GET_MODELS: "/models",
};

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
}
