"use client";
import { signIn, signOut, useSession } from "next-auth/react";

function NavBar() {
  const session = useSession();

  return (
    <div>
      Navbar
      <div>
        <div className="flex justify-between">
          <div>Music</div>
          <div>
            {!session?.data?.user && (
              <button
                className="m-2 p-2 bg-blue-400"
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            )}
            {session?.data && session?.data?.user && (
              <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>
                LogOut
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
