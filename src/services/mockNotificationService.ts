import type { BookmarkSetting, NotificationItem, Notice, UserPreference } from '@/src/types';
import { addHours, addMinutes, daysUntil } from '@/src/utils/dateUtils';

interface NotificationInput {
  notices: Notice[];
  preferences: UserPreference;
  bookmarks: BookmarkSetting[];
  readNotificationIds: string[];
  selectedUnitNames: string[];
}

export function createMockNotifications({
  notices,
  preferences,
  bookmarks,
  readNotificationIds,
  selectedUnitNames,
}: NotificationInput): NotificationItem[] {
  const selectedNames = new Set(selectedUnitNames);
  const readIds = new Set(readNotificationIds);
  const bookmarkIds = new Set(bookmarks.map((bookmark) => bookmark.noticeId));

  const latest = notices
    .filter((notice) => selectedNames.has(notice.sourceUnit) && !bookmarkIds.has(notice.id))
    .slice(0, 4)
    .map((notice, index) => ({
      id: `new-${notice.id}`,
      type: 'new_notice' as const,
      title: '새 공지 도착',
      body: `${notice.sourceUnit}의 "${notice.title}" 공지가 추가되었습니다.`,
      noticeId: notice.id,
      createdAt: index === 0 ? addMinutes(-12) : notice.publishedAt,
      read: readIds.has(`new-${notice.id}`),
    }));

  const keywordMatches = notices
    .filter((notice) =>
      !bookmarkIds.has(notice.id) &&
      preferences.keywords.some((keyword) =>
        `${notice.title} ${notice.content} ${notice.tags.join(' ')}`.includes(keyword),
      ),
    )
    .slice(0, 5)
    .map((notice, index) => ({
      id: `keyword-${notice.id}`,
      type: 'keyword_match' as const,
      title: '키워드 매칭',
      body: `등록 키워드와 관련된 공지입니다: ${notice.title}`,
      noticeId: notice.id,
      createdAt: addHours(-(index + 1)),
      read: readIds.has(`keyword-${notice.id}`),
    }));

  const deadlineReminders = bookmarks
    .map((bookmark) => notices.find((notice) => notice.id === bookmark.noticeId))
    .filter((notice): notice is Notice => Boolean(notice?.deadlineAt))
    .filter((notice) => {
      const days = daysUntil(notice.deadlineAt as string);
      return days >= 0 && days <= 7;
    })
    .map((notice, index) => ({
      id: `deadline-${notice.id}`,
      type: 'deadline_reminder' as const,
      title: '마감 임박',
      body: `${notice.title} 마감이 가까워졌습니다.`,
      noticeId: notice.id,
      createdAt: addHours(-(index + 2)),
      read: readIds.has(`deadline-${notice.id}`),
    }));

  const system: NotificationItem = {
    id: 'system-demo-ready',
    type: 'system',
    title: '데모 파이프라인 정상',
    body: '목 크롤러와 KoBERT 분류기 상태가 시스템 화면에 준비되었습니다.',
    createdAt: addHours(-4),
    read: readIds.has('system-demo-ready'),
  };

  if (!preferences.notificationsEnabled) {
    return system.read ? [] : [system];
  }

  return [...deadlineReminders, ...keywordMatches, ...latest, system]
    .filter((item) => !item.read)
    .slice(0, 14);
}
