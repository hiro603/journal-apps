import { Suspense } from "react";
import { FishingCalendarScreen } from "@/fishing/components/FishingCalendarScreen";

// useSearchParams はビルド時に値が決まらないため Suspense の内側に置く
export default function CalendarPage() {
  return (
    <Suspense>
      <FishingCalendarScreen />
    </Suspense>
  );
}
