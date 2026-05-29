/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "@/lib/api";
import { AuthService } from "@/lib/api-client";
import { getCartSession } from "@/lib/cart-session";
import type { AuthTokens, User as ApiUser, UserSummary } from "@/lib/api-client";

export type User = ApiUser | UserSummary;

export const authService = {
  login: (email: string, password: string): Promise<AuthTokens> => {
    const cartSessionId = getCartSession() || undefined;
    return api<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, cartSessionId }),
    });
  },
  logout: () => AuthService.postAuthLogout({ refreshToken: "dummy" }),
  register: (payload: { email: string; password: string; firstName: string; lastName: string }) =>
    AuthService.postAuthRegisterCustomer({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }),
};

export default authService;
