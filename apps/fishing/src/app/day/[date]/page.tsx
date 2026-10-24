import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isDateKey } from "@journal-apps/journal/lib/date";
import { FishingDayScreen } from "@/fishing/components/FishingDayScreen";

async function DayFromParams({ params }: Pick<PageProps<"/day/[date]">, "params">) {
  const { date } = await params;
  if (!isDateKey(date)) notFound();
  return <FishingDayScreen key={date} date={date} />;
}

export default function DayPage({ params }: PageProps<"/day/[date]">) {
  return (
    <Suspense>
      <DayFromParams params={params} />
    </Suspense>
  );
}
