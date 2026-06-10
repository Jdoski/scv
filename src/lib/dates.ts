// Formats a "YYYY-MM-DD" date string without timezone surprises.
export function formatPlayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Today's date as "YYYY-MM-DD" (UTC).
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
