import axios, { AxiosInstance } from "axios";
import { ENV } from "./env";

const ENDPOINTS = {
  GET_MODELS: "/models",
  SIGNUP: "/api/auth/signup",
  LOGIN: "/api/auth/login",
  VERIFY_EMAIL: "/api/auth/verify-email",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  CHANGE_PASSWORD: "/api/auth/change-password",
  UPLOAD_IMAGE: "/api/r2/upload",
  CREATE_ORDER: "/api/orders/create-order",
  MY_ORDERS: "/api/orders/my-orders",
  BLOGS: "/api/blogs",
  CONTACT: "/api/contact",
  UPDATE_PROFILE: "/api/auth/profile",
};

export interface SignUpPayload {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface BlogsParams {
  page?: number;
  limit?: number;
  published?: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderItem {
  modelid: string;
  customimage: string;
  quantity: number;
  material: string;
  designimage: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  email: string;
}

export interface ContactPayload {
  full_name: string;
  email: string;
  order_number: string;
  description: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  phone: string;
  profile_pic: string;
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

  public contact(payload: ContactPayload) {
    // Calling local Next.js API route
    return axios.post(ENDPOINTS.CONTACT, payload);
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

  public forgotPassword(payload: ForgotPasswordPayload) {
    return this.axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, payload);
  }

  public resetPassword(payload: ResetPasswordPayload) {
    return this.axiosInstance.post(ENDPOINTS.RESET_PASSWORD, payload);
  }

  public changePassword(payload: ChangePasswordPayload, bearerToken: string) {
    return this.axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, payload, {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });
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

  public createOrder(payload: CreateOrderPayload, bearerToken?: string) {
    const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined;
    return this.axiosInstance.post(ENDPOINTS.CREATE_ORDER, payload, { headers });
  }

  public getMyOrders(bearerToken: string) {
    return this.axiosInstance.get(ENDPOINTS.MY_ORDERS, {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });
  }

  public getBlogs(params: BlogsParams) {
    return this.axiosInstance.get(ENDPOINTS.BLOGS, { params });
  }

  public getBlogBySlug(slug: string) {
    return this.axiosInstance.get(`${ENDPOINTS.BLOGS}/slug/${slug}`);
  }

  public updateProfile(payload: UpdateProfilePayload, bearerToken: string) {
    return this.axiosInstance.patch(ENDPOINTS.UPDATE_PROFILE, payload, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
  }
}
