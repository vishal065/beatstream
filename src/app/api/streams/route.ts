import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-expect-error because youtube-search-api dont have types
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utlis";
import { auth } from "@/auth";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = YT_REGEX.test(data.url);
    // const isYt2 = data.url.match(YT_REGEX);

    if (!isYt) {
      return NextResponse.json(
        { message: "Wrong URL format" },
        { status: 411 }
      );
    }
    const extractedId: string = data.url.split("?v=")[1];
    console.log("extractedId---", data);

    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    console.log("res---", res);

    let thumbnails;
    thumbnails = res?.thumbnail?.thumbnails ?? "";
    if (thumbnails && thumbnails.length) {
      thumbnails.sort((a: { width: number }, b: { width: number }) =>
        a.width < b.width ? -1 : 1
      );
    } else {
      thumbnails = "";
    }

    console.log("111111111111111", thumbnails);

    const stream = await prismaClient.streams.create({
      data: {
        userId: data?.creatorId,
        url: data?.url,
        extractedId,
        type: "youtube",
        title: res.title ?? "cant find video",
        smallImg:
          (Array.isArray(thumbnails) && thumbnails?.length > 1
            ? thumbnails[thumbnails.length - 2]?.url
            : thumbnails[thumbnails.length - 1]?.url) ?? "",
        bigImg: Array.isArray(thumbnails)
          ? thumbnails[thumbnails.length - 1]?.url
          : "",
      },
    });
    console.log("222222222222222222222", stream);

    return NextResponse.json({
      message: "Added stream",
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (error) {
    console.error(error);

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
    const session = await auth();

    const user = await prismaClient.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }
    if (!creatorId) {
      return NextResponse.json(
        { message: "Error Get Stream" },
        { status: 411 }
      );
    }

    const [strems, activeStream] = await Promise.all([
      prismaClient.streams.findMany({
        where: {
          userId: creatorId,
          played: false,
        },
        include: {
          _count: {
            select: {
              upvotes: true,
            },
          },
          upvotes: {
            where: {
              userId: user.id,
            },
          },
        },
      }),
      prismaClient.currentStreams.findFirst({
        where: { userId: creatorId },
        include: { stream: true },
      }),
    ]);

    return NextResponse.json({
      streams: strems.map(({ _count, ...rest }) => ({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false,
      })),
      activeStream,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while fetching the stream", error },
      { status: 411 }
    );
  }
}
