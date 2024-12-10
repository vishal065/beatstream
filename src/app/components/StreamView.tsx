/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import axios from "axios";
import { Share2, Play, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
// import Image from "next/image";
import { YT_REGEX } from "../lib/utlis";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

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

const REFRESH_INTERVAL_MS = 10 * 1000;
const creatorId = "4d72dc8f-83fc-43f5-a772-23bb1cb0f4a8";

function StreamView({ creatorId }: { creatorId: string }) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshStreams() {
    try {
      const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("dashboard data", data);

      setQueue(
        data?.stream.sort((a: any, b: any) => (a.upvotes < b.upvotes ? 1 : -1))
      );
      console.log("refresh stream", data);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("queue", queue);

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    fetch(`/api/streams/upvote/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({ streamId: id }),
    });
  };

  const playNext = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
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
                ) : (
                  <p className="text-center py-8 text-gray-400">
                    No video playing
                  </p>
                )}
              </CardContent>
            </Card>
            <Button
              onClick={playNext}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Play /> Play Next
            </Button>
          </div>
        </div>
        <div>
          <div className="">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      ></ToastContainer>
    </div>
  );
}

export default StreamView;
