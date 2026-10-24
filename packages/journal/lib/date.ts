// 日付は "YYYY-MM-DD" のローカル日付で扱う。toISOString は UTC になり、日本の朝9時前が前日になるので使わない
const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// URL から来る値の検証用。"2026-02-30" のような存在しない日も弾く
export function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && toDateKey(parseDateKey(value)) === value;
}

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDateLabel(key: string): string {
  const date = parseDateKey(key);
  return `${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]})`;
}

export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

// 月は "YYYY-MM" で扱う
export function toMonthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function isMonthKey(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function addMonths(month: string, months: number): string {
  const [y, m] = month.split("-").map(Number);
  return toMonthKey(toDateKey(new Date(y, m - 1 + months, 1)));
}

export function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${y}年${m}月`;
}

// 日曜始まりのカレンダー用。1日より前の空きマスは null
export function monthGrid(month: string): (string | null)[] {
  const [y, m] = month.split("-").map(Number);
  const firstWeekday = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const blanks: null[] = Array(firstWeekday).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => `${month}-${pad(i + 1)}`);
  return [...blanks, ...days];
}
