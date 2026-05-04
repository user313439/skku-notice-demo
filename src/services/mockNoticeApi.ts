import { mockNotices } from '@/src/data/mockNotices';
import type { Notice } from '@/src/types';

export async function fetchNotices(): Promise<Notice[]> {
  return mockNotices;
}

export async function fetchNoticeById(id: string): Promise<Notice | undefined> {
  return mockNotices.find((notice) => notice.id === id);
}

export function getNoticeById(id: string) {
  return mockNotices.find((notice) => notice.id === id);
}
