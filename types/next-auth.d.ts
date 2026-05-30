import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phone?: string;
      avatar?: string;
    } & DefaultSession["user"];
  }
}
