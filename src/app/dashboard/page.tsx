"use client";
import { useSession } from "next-auth/react";
import StreamView from "../components/StreamView";

function Dashboard() {
  const session = useSession();

  return (
    <StreamView
      creatorId={(session?.data?.user?.id as string) || ""}
      playVideo={true}
    />
  );
}

export default Dashboard;
