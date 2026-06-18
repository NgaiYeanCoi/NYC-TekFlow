import "next-auth";
import "next-auth/jwt";
import type { UserSummary } from "@/types/tekflow";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expiresAt?: number;
    user: UserSummary;
  }

  interface User {
    backendId: number;
    username: string;
    role: string;
    accessToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    backendId?: number;
    username?: string;
    role?: string;
  }
}
