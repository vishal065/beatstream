import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn(params) {
      try {
        console.log("params in signin", params);
      } catch (error) {
        console.log("error is ", error);
      }
      return true;
    },
  },
});
