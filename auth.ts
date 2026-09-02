import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { verifyPassword } from "@/lib/auth/hash";
import { findUserByEmail } from "@/lib/auth/userStore";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "petakarier_super_secret_auth_key_2026_itechnocup_sdg8",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHub({
      clientId: process.env.GITHUB_ID ?? process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const user = await findUserByEmail(email);

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await verifyPassword(password, user.hashedPassword);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image ?? token.picture ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user) {
        session.user.image = (token.picture as string | null) ?? session.user.image ?? null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is a relative path, resolve it against the baseUrl
      if (url.startsWith("/")) {
        // Don't redirect back to login or signup pages after auth
        if (url.startsWith("/login") || url.startsWith("/signup")) {
          return baseUrl;
        }
        return `${baseUrl}${url}`;
      }
      // If the url is on the same origin, allow it
      if (url.startsWith(baseUrl)) {
        // Don't redirect back to login or signup pages after auth
        const path = url.replace(baseUrl, "");
        if (path.startsWith("/login") || path.startsWith("/signup")) {
          return baseUrl;
        }
        return url;
      }
      // Default: redirect to home
      return baseUrl;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Protected routes that require login
      const protectedPaths = [
        "/analisis",
        "/kalkulator",
        "/perbandingan",
        "/rencana-bisnis",
        "/sdg-impact",
        "/komunitas",
      ];

      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (isProtected) {
        return isLoggedIn;
      }

      return true;
    },
  },
});
