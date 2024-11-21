import { prismaClient } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownVoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = await prismaClient.user.findFirst({
    where: { email: session?.user?.email ?? "" },
  });
  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  try {
    const data = DownVoteSchema.parse(await req.json());

    await prismaClient.upvotes.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });
  } catch (error) {
    NextResponse.json(
      { message: "Error while downvoating", error },
      { status: 411 }
    );
  }
}
