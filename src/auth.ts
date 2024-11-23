import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./app/lib/db"; // Make sure prismaClient is properly initialized

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID, // Make sure this is defined in .env.local
      clientSecret: process.env.AUTH_GOOGLE_SECRET, // Make sure this is defined in .env.local
    }),
  ],
  debug: true, // Enable debugging for detailed logs
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("params in signin", { user, account, profile });

        // Ensure the user has an email
        if (!user?.email) {
          console.log("No email found for user");
          return false; // Return false to deny access
        }

        // Check if the user already exists
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // If the user doesn't exist, create a new user
          await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
          console.log("User created:", user.email);
        } else {
          console.log("User already exists:", user.email);
        }
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false; // If any error occurs, deny the sign-in
      }
      return true; // Allow the sign-in
    },
  },
});
