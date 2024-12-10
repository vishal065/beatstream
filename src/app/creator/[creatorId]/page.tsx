import StreamView from "@/app/components/StreamView";

function page({
  params: { creatorId },
}: {
  params: {
    creatorId: string;
  };
}) {
  return (
    <div>
      <StreamView creatorId={creatorId} />
    </div>
  );
}

export default page;
