"use client";
import { signIn } from "next-auth/react";

function NavBar() {
  return (
    <div>
      Navbar
      <div>
        <button onClick={() => signIn("google")}>Sign In</button>
      </div>
    </div>
  );
}

export default NavBar;
