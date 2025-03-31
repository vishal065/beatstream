/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Share2, Play, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
// import Image from "next/image";
import { YT_REGEX } from "../lib/utlis";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import YouTubePlayer from "youtube-player";

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}

// const REFRESH_INTERVAL_MS = 10 * 1000;

function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string | null;
  playVideo: boolean;
}) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);

  async function refreshStreams() {
    try {
      if (creatorId?.trim() === "") {
        toast.error("Invalid Creator id", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      setQueue(
        data?.streams?.sort((a: any, b: any) =>
          a.upvotes < b.upvotes ? 1 : -1
        )
      );
      setCurrentVideo((video) => {
        if (video?.id === data?.activeStream?.stream?.id) {
          return video;
        }
        return data?.activeStream?.stream ?? "";
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    refreshStreams();
    // const interval = setInterval(() => {
    //   // refreshStreams();
    // }, REFRESH_INTERVAL_MS);
  }, [creatorId]);

  useEffect(() => {
    if (!videoPlayerRef.current) {
      return;
    }
    const player = YouTubePlayer(videoPlayerRef.current);
    player.loadVideoById(currentVideo?.extractedId ?? "");
    player.playVideo();

    function eventHandler(event: any) {
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);

    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creatorId || creatorId.trim() === "") {
      toast.error("Invalid Creator id", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCurrentVideo(null);
      setQueue([]);
      setInputLink("");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/streams`, {
      method: "POST",
      body: JSON.stringify({
        creatorId,
        url: inputLink,
      }),
    });

    setQueue([...queue, await res.json()]);
    setLoading(false);
    setInputLink("");
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );
    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({ streamId: id }),
    });
  };

  const playNext = async () => {
    if (queue?.length > 0) {
      const res = await fetch(`/api/streams/next`, {
        method: "GET",
      });
      const data = await res.json();

      setCurrentVideo(data?.stream);
      setQueue((q) => q.filter((x) => x.id !== data?.stream?.id));
    }
  };
  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
    navigator.clipboard.writeText(shareableLink).then(() =>
      toast.success("Link copy to clipboard", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200">
      <NavBar />
      <div className="flex justify-center p-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
            <div className="flex justify-between items-center">
              <h1 className=" text-3xl font-bold text-white">
                Song Voting Queue
              </h1>
              <Button
                onClick={handleShare}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                type="text"
                placeholder="Paste Youtube link here"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
              />
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white"
              >
                {loading ? "loading..." : "Add to Queue"}
              </Button>
            </form>
            {inputLink && inputLink.match(YT_REGEX) && !loading && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <LiteYouTubeEmbed title="" id={inputLink.split("?v=")[1]} />
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Now Playing</h2>
              <Card className=" bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  {currentVideo ? (
                    <div>
                      {playVideo ? (
                        <div ref={videoPlayerRef} className="w-full"></div>
                      ) : (
                        // <iframe
                        //   src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                        //   allow="autoplay"
                        //   width={`100%`}
                        // ></iframe>
                        <>
                          <img
                            src=""
                            alt="Current Video"
                            className="w-full h-72 object-cover rounded"
                          />
                          <p className="mt-2 text-center font-semibold text-white">
                            {currentVideo.title}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-400">
                      No video playing
                    </p>
                  )}
                </CardContent>
              </Card>
              {playVideo && (
                <Button
                  onClick={playNext}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <Play /> Play Next
                </Button>
              )}
            </div>
          </div>
          <div>
            <div className="">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  Upcoming Songs
                </h2>
                {queue?.length === 0 && (
                  <Card className="bg-gray-900 border-gray-800 w-full">
                    <CardContent className="p-4">
                      <p className="text-center py-8 text-gray-400">
                        No Videos in queue
                      </p>
                    </CardContent>
                  </Card>
                )}
                {queue?.map((video) => (
                  <Card key={video.id} className=" bg-gray-900 border-gray-800">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <img
                        src={video?.smallImg}
                        alt={`Thumbnail for ${video.title}`}
                        className="w-30 h-20 object-cover rounded"
                      />
                      <div className=" flex-grow">
                        <h3 className="font-semibold text-white">
                          {video.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleVote(
                                video.id,
                                video.haveUpvoted ? false : true
                              )
                            }
                            className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                          >
                            {video.haveUpvoted ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronUp />
                            )}
                            <span>{video.upvotes}</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamView;
