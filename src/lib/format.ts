export function pluralYr(n: number): string {
  return n === 1 ? "yr" : "yrs";
}

export function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function timeUntilMeeting(meetingDateStr: string): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const meeting = new Date(meetingDateStr + "T00:00:00");
  const diffMs = meeting.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Past";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 14) return "In 1 week";
  return `In ${Math.floor(diffDays / 7)} weeks`;
}
