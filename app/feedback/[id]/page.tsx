import { Suspense } from "react";

export default function FeedbackDetailPage({
  params,
}: PageProps<"/feedback/[id]">) {
  return (
    <main>
      <Suspense fallback={null}>
        <FeedbackDetail params={params} />
      </Suspense>
    </main>
  );
}

async function FeedbackDetail({
  params,
}: Pick<PageProps<"/feedback/[id]">, "params">) {
  const { id } = await params;

  return <h1 className="text-h1 text-navy">Feedback {id}</h1>;
}
