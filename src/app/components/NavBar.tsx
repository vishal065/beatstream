"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function NavBar() {
  const session = useSession();
  console.log(session);
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard");
    }
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div>
      <div>
        <div className="flex justify-between ">
          {/* <div className=" font-bold flex flex-col justify-center text-white">
            Music
          </div> */}
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
