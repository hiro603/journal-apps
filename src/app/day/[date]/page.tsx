import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isDateKey } from "@/lib/date";
import { MealDayScreen } from "@/meal/components/MealDayScreen";

async function DayFromParams({ params }: Pick<PageProps<"/day/[date]">, "params">) {
  const { date } = await params;
  if (!isDateKey(date)) notFound();
  // 日付ごとに画面を作り直し、保存待ちのメモが別の日に書き込まれないようにする
  return <MealDayScreen key={date} date={date} />;
}

export default function DayPage({ params }: PageProps<"/day/[date]">) {
  return (
    <Suspense>
      <DayFromParams params={params} />
    </Suspense>
  );
}
