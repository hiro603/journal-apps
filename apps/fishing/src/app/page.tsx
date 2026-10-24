"use client";

import { useToday } from "@journal-apps/journal/lib/useToday";
import { FishingDayScreen } from "@/fishing/components/FishingDayScreen";

export default function TodayPage() {
  const today = useToday();
  return today && <FishingDayScreen key={today} date={today} />;
}
