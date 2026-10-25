import { Suspense } from "react";
import { TripScreen } from "@/fishing/components/TripScreen";

async function TripFromParams({ params }: Pick<PageProps<"/trip/[id]">, "params">) {
  const { id } = await params;
  // 釣行ごとに画面を作り直し、保存待ちの入力が別の釣行に書き込まれないようにする
  return <TripScreen key={id} id={id} />;
}

export default function TripPage({ params }: PageProps<"/trip/[id]">) {
  return (
    <Suspense>
      <TripFromParams params={params} />
    </Suspense>
  );
}
