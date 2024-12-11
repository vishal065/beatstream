import { prismaClient } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  //TODO: Replace this with id everywhere
  //TODO: you can get rid of the db call here

  const user = await prismaClient.user.findFirst({
    where: { email: session?.user?.email ?? "" },
  });
  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  const data = UpvoteSchema.parse(await req.json());

  try {
    await prismaClient.upvotes.create({
      data: { userId: user.id, streamId: data.streamId },
    });
    return NextResponse.json({ message: "Done" });
  } catch (error) {
    NextResponse.json(
      { message: "Error While upvoting", error },
      { status: 403 }
    );
  }
}
