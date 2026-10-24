"use client";

import { MealDayScreen } from "@/meal/components/MealDayScreen";
import { useToday } from "@/lib/useToday";

export default function TodayPage() {
  const today = useToday();
  return today && <MealDayScreen key={today} date={today} />;
}
