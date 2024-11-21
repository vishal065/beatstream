import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const YT_REGEX = new RegExp("https://www.youtube.com/watch?v=[w-]+");

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(), //has youtube or spotify inside url
});
export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = YT_REGEX.test(data.url);
    if (!isYt) {
      return NextResponse.json(
        { message: "Wrong URL format" },
        { status: 411 }
      );
    }
    const extractedId = data.url.split("?v=")[1];

    prismaClient.streams.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "youtube",
      },
    });
    console.log(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while adding a stream",
        error: error,
      },
      { status: 411 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const strems = await prismaClient.streams.findMany({
      where: {
        userId: creatorId ?? "",
      },
    });
    return NextResponse.json(
      { message: "Streams are", strems },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error while fetching the stream", error },
      { status: 411 }
    );
  }
}
