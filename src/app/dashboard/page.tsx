"use client";

import { useSession } from "next-auth/react";
import StreamView from "../components/StreamView";

const creatorId = "b8ef5b31-d17a-43de-a86b-dccdb18405ad";

function Dashboard() {
  const session = useSession();
  return <StreamView creatorId={creatorId} playVideo={true} />;
}

export default Dashboard;
