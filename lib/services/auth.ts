/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthControllerService } from "@/lib/api-client";
import type { UserResponse, AuthResponse } from "@/lib/api-client";

export type User = UserResponse;

export const authService = {
  login: (email: string, password: string) => AuthControllerService.login({ email, password }),
  logout: () => Promise.resolve(),
  register: (payload: { email: string; password: string; name: string; lastname: string; dni: string; phone?: string }) =>
    AuthControllerService.register({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      lastname: payload.lastname,
      phone: payload.phone || "",
      dni: payload.dni,
    }),
  forgotPassword: (email: string) => AuthControllerService.forgotPassword({ email }),
  resetPassword: (token: string, password: string) => AuthControllerService.resetPassword({ token, password }),
};

export default authService;
