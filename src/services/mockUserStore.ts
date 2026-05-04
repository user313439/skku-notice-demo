import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultAcademicUnitIds, mockAcademicUnits } from '@/src/data/mockAcademicUnits';
import { mockNotices } from '@/src/data/mockNotices';
import type { BookmarkSetting, UserPreference } from '@/src/types';

const STORAGE_KEY = 'skku-notice-demo:user-snapshot';

export interface UserSnapshot {
  preferences: UserPreference;
  bookmarks: BookmarkSetting[];
  readNoticeIds: string[];
  readNotificationIds: string[];
}

export const defaultSnapshot: UserSnapshot = {
  preferences: {
    profileName: '성균관대 데모 학생',
    profileStudentId: '2026310000',
    profileEmail: 'demo.student@skku.edu',
    selectedUnitIds: defaultAcademicUnitIds,
    keywords: ['장학금', '삼성전자', '인턴', '졸업'],
    notificationsEnabled: true,
    hasOnboarded: false,
  },
  bookmarks: [
    { noticeId: 'real-cse-001', reminderOption: '3d', createdAt: new Date().toISOString() },
    { noticeId: 'real-cse-009', reminderOption: '7d', createdAt: new Date().toISOString() },
  ],
  readNoticeIds: [],
  readNotificationIds: [],
};

export async function loadUserSnapshot(): Promise<UserSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSnapshot;
    }
    const parsed = JSON.parse(raw) as UserSnapshot;
    const validIds = new Set(mockAcademicUnits.map((unit) => unit.id));
    const validNoticeIds = new Set(mockNotices.map((notice) => notice.id));
    const legacyIdMap: Record<string, string> = {
      'global-convergence': 'dept-global-convergence',
    };
    const selectedUnitIds = (parsed.preferences?.selectedUnitIds ?? defaultAcademicUnitIds)
      .map((id) => legacyIdMap[id] ?? id)
      .filter((id) => validIds.has(id));
    const rawBookmarks = parsed.bookmarks ?? defaultSnapshot.bookmarks;
    const validBookmarks = rawBookmarks.filter((bookmark) => validNoticeIds.has(bookmark.noticeId));
    return {
      preferences: {
        ...defaultSnapshot.preferences,
        ...parsed.preferences,
        selectedUnitIds: selectedUnitIds.length ? selectedUnitIds : defaultAcademicUnitIds,
      },
      bookmarks: validBookmarks.length || rawBookmarks.length === 0 ? validBookmarks : defaultSnapshot.bookmarks,
      readNoticeIds: parsed.readNoticeIds ?? [],
      readNotificationIds: parsed.readNotificationIds ?? [],
    };
  } catch {
    return defaultSnapshot;
  }
}

export async function saveUserSnapshot(snapshot: UserSnapshot) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
