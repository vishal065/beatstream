function page({
  params: { creatorId },
}: {
  params: {
    creatorId: string;
  };
}) {
  return <div>page {creatorId}</div>;
}

export default page;
