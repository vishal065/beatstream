"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

function NavBar() {
  const session = useSession();

  return (
    <div>
      <div>
        <div className="flex justify-between ">
          <div className=" font-bold flex flex-col justify-center text-white">
            Music
          </div>
          <div>
            {!session?.data?.user && (
              <Button
                className="m-2 p-2 bg-blue-400"
                onClick={() => signIn("google")}
              >
                Sign In
              </Button>
            )}
            {session?.data && session?.data?.user && (
              <Button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>
                LogOut
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
