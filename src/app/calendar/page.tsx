import { Suspense } from "react";
import { MealCalendarScreen } from "@/meal/components/MealCalendarScreen";

// useSearchParams はビルド時に値が決まらないため Suspense の内側に置く
export default function CalendarPage() {
  return (
    <Suspense>
      <MealCalendarScreen />
    </Suspense>
  );
}
