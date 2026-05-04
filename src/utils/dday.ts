import type { DeadlineStatus } from '@/src/types';
import { daysUntil } from './dateUtils';

export function getDeadlineStatus(deadlineAt: string | null, rawDeadlineText: string): DeadlineStatus {
  if (!deadlineAt && rawDeadlineText.includes('상시')) {
    return 'always';
  }
  if (!deadlineAt) {
    return 'none';
  }
  const diff = daysUntil(deadlineAt);
  if (diff < 0) {
    return 'closed';
  }
  if (diff === 0) {
    return 'today';
  }
  return 'upcoming';
}

export function getDDayLabel(deadlineAt: string | null, rawDeadlineText: string) {
  const status = getDeadlineStatus(deadlineAt, rawDeadlineText);
  if (status === 'always') {
    return '상시';
  }
  if (status === 'none') {
    return '일정 없음';
  }
  if (status === 'closed') {
    return '마감';
  }
  const diff = daysUntil(deadlineAt as string);
  return diff === 0 ? 'D-Day' : `진행중 D-${diff}`;
}

export function getDeadlineTone(status: DeadlineStatus, deadlineAt?: string | null) {
  if (status === 'closed') {
    return 'closed';
  }
  if (status === 'today') {
    return 'urgent';
  }
  if (status === 'upcoming') {
    const diff = deadlineAt ? daysUntil(deadlineAt) : 99;
    if (diff <= 3) {
      return 'urgent';
    }
    if (diff <= 7) {
      return 'warning';
    }
    return 'success';
  }
  if (status === 'always') {
    return 'success';
  }
  return 'neutral';
}
