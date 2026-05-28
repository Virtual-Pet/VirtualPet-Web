/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthService } from "@/lib/api-client";
import type { User as ApiUser, UserSummary } from "@/lib/api-client";

export type User = ApiUser | UserSummary;

export const authService = {
  login: (email: string, password: string) => AuthService.postAuthLogin({ email, password }),
  logout: () => AuthService.postAuthLogout({ refreshToken: "dummy" }), // Real logout will need the token logic handled elsewhere if needed
  register: (payload: { email: string; password: string; firstName: string; lastName: string; }) =>
    AuthService.postAuthRegisterCustomer({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }),
};

export default authService;
