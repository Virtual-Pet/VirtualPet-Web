import { AuthService } from "@/lib/api-client";
import type { AuthTokens, User as ApiUser, UserSummary } from "@/lib/api-client";

export type User = ApiUser | UserSummary;

export const authService = {
  // The anonymous cart is merged automatically by the backend from the CART_SESSION cookie
  // (carried via credentials: "include"); no cartSessionId is sent. The backend clears the
  // cookie after merging.
  login: (email: string, password: string): Promise<AuthTokens> =>
    AuthService.postAuthLogin({ email, password }),
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
