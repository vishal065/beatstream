import { prismaClient } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  const user = await prismaClient.user.findFirst({
    where: { email: session?.user?.email ?? "" },
  });
  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  const mostUpvotedStream = await prismaClient.streams.findFirst({
    where: { userId: session?.user?.id, played: false },
    orderBy: { upvotes: { _count: "desc" } },
  });

  await Promise.all([
    prismaClient.currentStreams.upsert({
      where: { userId: user?.id },
      update: { streamId: mostUpvotedStream?.id },
      create: { userId: user?.id, streamId: mostUpvotedStream?.id },
    }),
    prismaClient.streams.update({
      where: {
        id: mostUpvotedStream?.id ?? "",
      },
      data: {
        played: true,
        playedTs: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ stream: mostUpvotedStream }, { status: 200 });
}
