const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export function todayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function addDays(days: number) {
  const date = todayStart();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function addHours(hours: number) {
  return new Date(Date.now() + hours * HOUR_MS).toISOString();
}

export function addMinutes(minutes: number) {
  return new Date(Date.now() + minutes * MINUTE_MS).toISOString();
}

export function daysUntil(dateString: string) {
  const dateOnly = dateString.slice(0, 10);
  const target = new Date(`${dateOnly}T00:00:00`);
  return Math.round((target.getTime() - todayStart().getTime()) / DAY_MS);
}

export function formatDateKo(dateString: string | null) {
  if (!dateString) {
    return '일정 없음';
  }
  const [year, month, day] = dateString.slice(0, 10).split('-');
  return `${year}.${month}.${day}`;
}

export function formatRelativePublished(dateString: string) {
  const published = new Date(dateString);
  if (!Number.isNaN(published.getTime())) {
    const diffMs = Date.now() - published.getTime();
    if (diffMs >= 0 && diffMs < HOUR_MS) {
      return `${Math.max(1, Math.floor(diffMs / MINUTE_MS))}분 전`;
    }
    if (diffMs >= 0 && diffMs < DAY_MS) {
      return `${Math.floor(diffMs / HOUR_MS)}시간 전`;
    }
  }
  const diff = Math.abs(daysUntil(dateString));
  if (diff === 0) {
    return '오늘';
  }
  if (diff === 1) {
    return '어제';
  }
  return `${diff}일 전`;
}

export function nowIso() {
  return new Date().toISOString();
}
