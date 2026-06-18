import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { apiFetch } from "@/lib/api/client";
import type { LoginResponse, UserSummary } from "@/types/tekflow";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "tekflow-local-development-auth-secret",
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");
        if (!username || !password) {
          return null;
        }
        try {
          const data = await apiFetch<LoginResponse>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
          return {
            id: String(data.user.id),
            backendId: data.user.id,
            username: data.user.username,
            name: data.user.name,
            email: data.user.email ?? undefined,
            role: data.user.role,
            accessToken: data.token,
            expiresAt: data.expiresAt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendId = user.backendId;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.expiresAt = user.expiresAt;
      }
      return token;
    },
    async session({ session, token }) {
      const appSession = session as typeof session & {
        accessToken?: string;
        expiresAt?: number;
        user: UserSummary;
      };
      appSession.accessToken = token.accessToken;
      appSession.expiresAt = token.expiresAt;
      Reflect.set(appSession, "user", {
        id: Number(token.backendId),
        username: String(token.username ?? ""),
        name: String(token.name ?? ""),
        email: typeof token.email === "string" ? token.email : null,
        role: String(token.role ?? "admin"),
      } satisfies UserSummary);
      return appSession;
    },
  },
});
