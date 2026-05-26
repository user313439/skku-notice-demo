import type { BookmarkSetting, Notice, NoticeFilter } from '@/src/types';
import { getDeadlineStatus } from './dday';

export function filterNotices(
  notices: Notice[],
  filter: NoticeFilter,
  readNoticeIds: string[],
  bookmarks: BookmarkSetting[],
) {
  const bookmarkIds = new Set(bookmarks.map((bookmark) => bookmark.noticeId));
  const readIds = new Set(readNoticeIds);
  const query = filter.query?.trim().toLowerCase();

  return notices.filter((notice) => {
    if (query) {
      const haystack = `${notice.title} ${notice.content} ${notice.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (filter.category && filter.category !== '전체' && notice.category !== filter.category) {
      return false;
    }
    if (filter.unitName && notice.sourceUnit !== filter.unitName) {
      return false;
    }
    if (filter.unitNames?.length && !filter.unitNames.includes(notice.sourceUnit)) {
      return false;
    }
    if (filter.bookmarkOnly && !bookmarkIds.has(notice.id)) {
      return false;
    }
    if (filter.bookmarkStatus === 'bookmarked' && !bookmarkIds.has(notice.id)) {
      return false;
    }
    if (filter.bookmarkStatus === 'notBookmarked' && bookmarkIds.has(notice.id)) {
      return false;
    }
    if (filter.readStatus === 'read' && !readIds.has(notice.id)) {
      return false;
    }
    if (filter.readStatus === 'unread' && readIds.has(notice.id)) {
      return false;
    }
    if (filter.deadlineStatus && filter.deadlineStatus !== 'all') {
      const status = getDeadlineStatus(notice.deadlineAt, notice.rawDeadlineText);
      if (status !== filter.deadlineStatus) {
        return false;
      }
    }
    return true;
  });
}

export function sortByDeadline(notices: Notice[]) {
  return [...notices].sort((a, b) => {
    if (!a.deadlineAt && !b.deadlineAt) {
      return a.publishedAt < b.publishedAt ? 1 : -1;
    }
    if (!a.deadlineAt) {
      return 1;
    }
    if (!b.deadlineAt) {
      return -1;
    }
    return a.deadlineAt.localeCompare(b.deadlineAt);
  });
}

export function sortByUpcomingDeadline(notices: Notice[]) {
  return [...notices]
    .filter((notice) => {
      const status = getDeadlineStatus(notice.deadlineAt, notice.rawDeadlineText);
      return status === 'upcoming' || status === 'today';
    })
    .sort((a, b) => (a.deadlineAt ?? '').localeCompare(b.deadlineAt ?? ''));
}
