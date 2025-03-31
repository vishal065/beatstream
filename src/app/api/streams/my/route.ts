import { prismaClient } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  const streams = await prismaClient.streams.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: { where: { userId: user.id } },
    },
  });

  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
  });
}
