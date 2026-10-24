import { Suspense } from "react";

// 釣行の編集画面（中身はステップ4で作る）
async function TripFromParams({ params }: Pick<PageProps<"/trip/[id]">, "params">) {
  const { id } = await params;
  return <h1>釣行 {id}</h1>;
}

export default function TripPage({ params }: PageProps<"/trip/[id]">) {
  return (
    <Suspense>
      <TripFromParams params={params} />
    </Suspense>
  );
}
