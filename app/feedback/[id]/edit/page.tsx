import { Suspense } from "react";

export default function EditFeedbackPage({
  params,
}: PageProps<"/feedback/[id]/edit">) {
  return (
    <main>
      <Suspense fallback={null}>
        <EditFeedback params={params} />
      </Suspense>
    </main>
  );
}

async function EditFeedback({
  params,
}: Pick<PageProps<"/feedback/[id]/edit">, "params">) {
  const { id } = await params;

  return <h1 className="text-h1 text-navy">Editing Feedback {id}</h1>;
}
