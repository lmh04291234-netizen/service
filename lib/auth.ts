import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import { upsertOAuthUser, verifyCredentials } from "@/lib/users";

function hasValue(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

const googleConfigured = hasValue(process.env.GOOGLE_CLIENT_ID) && hasValue(process.env.GOOGLE_CLIENT_SECRET);
const naverConfigured = hasValue(process.env.NAVER_CLIENT_ID) && hasValue(process.env.NAVER_CLIENT_SECRET);
const authSecret =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "billyeobom-prototype-auth-secret-change-this-before-real-users";

const providers: NextAuthOptions["providers"] = [
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
        email: "google.dev@billyeobom.local"
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
        email: "naver.dev@billyeobom.local"
      };
    }
  })
];

if (googleConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  );
}

if (naverConfigured) {
  providers.push(
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt"
  },
  providers,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" || account?.provider === "naver") {
        const profileWithEmail = profile as { email?: string; name?: string } | undefined;

        try {
          await upsertOAuthUser({
            provider: account.provider,
            email: user.email ?? profileWithEmail?.email,
            name: user.name ?? profileWithEmail?.name
          });
        } catch (error) {
          console.warn("OAuth user persistence failed. Login will continue.", error);
        }
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
