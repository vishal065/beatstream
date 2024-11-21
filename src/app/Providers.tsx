"use client";
//recoil , theme Provider
import { SessionProvider } from "next-auth/react";
import React from "react";

function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
