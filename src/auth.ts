import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./app/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID, // Make sure this is defined in .env.local
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  debug: true, // Enable debugging for detailed logs
  secret: process.env.AUTH_SECRET ?? "secret",
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user?.email) {
          console.log("No email found for user");
          return false; // Return false to deny access
        }

        let existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });
        if (!existingUser) {
          existingUser = await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
        }
        user.id = existingUser.id;
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false; // If any error occurs, deny the sign-in
      }
      return true; // Allow the sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
