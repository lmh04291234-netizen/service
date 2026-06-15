import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import { upsertOAuthUser, verifyCredentials } from "@/lib/users";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        return verifyCredentials(credentials.email, credentials.password);
      }
    }),
    CredentialsProvider({
      id: "google-demo",
      name: "Google Demo",
      credentials: {},
      async authorize() {
        return {
          id: "google-demo-user",
          name: "Google Dev User",
          email: "google.dev@matjam.local"
        };
      }
    }),
    CredentialsProvider({
      id: "naver-demo",
      name: "Naver Demo",
      credentials: {},
      async authorize() {
        return {
          id: "naver-demo-user",
          name: "Naver Dev User",
          email: "naver.dev@matjam.local"
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" || account?.provider === "naver") {
        const profileWithEmail = profile as { email?: string; name?: string } | undefined;

        await upsertOAuthUser({
          provider: account.provider,
          email: user.email ?? profileWithEmail?.email,
          name: user.name ?? profileWithEmail?.name
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
      }
      return session;
    }
  },
  pages: {
    signIn: "/"
  }
};
