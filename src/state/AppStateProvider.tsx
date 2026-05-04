import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mockAcademicUnits, mockColleges } from '@/src/data/mockAcademicUnits';
import { mockNotices } from '@/src/data/mockNotices';
import { createMockNotifications } from '@/src/services/mockNotificationService';
import {
  defaultSnapshot,
  loadUserSnapshot,
  saveUserSnapshot,
  type UserSnapshot,
} from '@/src/services/mockUserStore';
import type { BookmarkSetting, ReminderOption, UserPreference } from '@/src/types';
import { nowIso } from '@/src/utils/dateUtils';

interface AppStateValue extends UserSnapshot {
  academicUnits: typeof mockAcademicUnits;
  colleges: typeof mockColleges;
  notices: typeof mockNotices;
  hydrated: boolean;
  selectedUnitNames: string[];
  notifications: ReturnType<typeof createMockNotifications>;
  bookmarkMap: Record<string, BookmarkSetting>;
  completeOnboarding: (selectedUnitIds: string[], keywords: string[]) => void;
  setSelectedUnitIds: (selectedUnitIds: string[]) => void;
  updateProfile: (profile: Pick<UserPreference, 'profileName' | 'profileStudentId' | 'profileEmail'>) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  toggleNotifications: () => void;
  toggleBookmark: (noticeId: string) => void;
  setReminderOption: (noticeId: string, reminderOption: ReminderOption) => void;
  markNoticeRead: (noticeId: string) => void;
  markNotificationRead: (notificationId: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<UserSnapshot>(defaultSnapshot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadUserSnapshot().then((loaded) => {
      setSnapshot(loaded);
      setHydrated(true);
    });
  }, []);

  const updateSnapshot = (updater: (current: UserSnapshot) => UserSnapshot) => {
    setSnapshot((current) => {
      const next = updater(current);
      void saveUserSnapshot(next);
      return next;
    });
  };

  const selectedUnitNames = useMemo(() => {
    const selected = new Set(snapshot.preferences.selectedUnitIds);
    const selectedCollegeIds = new Set(
      mockAcademicUnits
        .filter((unit) => unit.kind === 'college' && selected.has(unit.id))
        .map((unit) => unit.id),
    );
    return mockAcademicUnits
      .filter((unit) => selected.has(unit.id) || (unit.collegeId && selectedCollegeIds.has(unit.collegeId)))
      .map((unit) => unit.name);
  }, [snapshot.preferences.selectedUnitIds]);

  const bookmarkMap = useMemo(
    () =>
      snapshot.bookmarks.reduce<Record<string, BookmarkSetting>>((acc, bookmark) => {
        acc[bookmark.noticeId] = bookmark;
        return acc;
      }, {}),
    [snapshot.bookmarks],
  );

  const notifications = useMemo(
    () =>
      createMockNotifications({
        notices: mockNotices,
        preferences: snapshot.preferences,
        bookmarks: snapshot.bookmarks,
        readNotificationIds: snapshot.readNotificationIds,
        selectedUnitNames,
      }),
    [snapshot.preferences, snapshot.bookmarks, snapshot.readNotificationIds, selectedUnitNames],
  );

  const patchPreferences = (patch: Partial<UserPreference>) => {
    updateSnapshot((current) => ({
      ...current,
      preferences: { ...current.preferences, ...patch },
    }));
  };

  const value: AppStateValue = {
    ...snapshot,
    academicUnits: mockAcademicUnits,
    colleges: mockColleges,
    notices: mockNotices,
    hydrated,
    selectedUnitNames,
    notifications,
    bookmarkMap,
    completeOnboarding: (selectedUnitIds, keywords) =>
      patchPreferences({
        selectedUnitIds,
        keywords: keywords.map((keyword) => keyword.trim()).filter(Boolean),
        hasOnboarded: true,
      }),
    setSelectedUnitIds: (selectedUnitIds) => patchPreferences({ selectedUnitIds }),
    updateProfile: (profile) => patchPreferences(profile),
    addKeyword: (keyword) => {
      const normalized = keyword.trim();
      if (!normalized || snapshot.preferences.keywords.includes(normalized)) {
        return;
      }
      patchPreferences({ keywords: [...snapshot.preferences.keywords, normalized] });
    },
    removeKeyword: (keyword) =>
      patchPreferences({
        keywords: snapshot.preferences.keywords.filter((item) => item !== keyword),
      }),
    toggleNotifications: () =>
      patchPreferences({ notificationsEnabled: !snapshot.preferences.notificationsEnabled }),
    toggleBookmark: (noticeId) => {
      updateSnapshot((current) => {
        const exists = current.bookmarks.some((bookmark) => bookmark.noticeId === noticeId);
        return {
          ...current,
          bookmarks: exists
            ? current.bookmarks.filter((bookmark) => bookmark.noticeId !== noticeId)
            : [
                ...current.bookmarks,
                { noticeId, reminderOption: '3d', createdAt: nowIso() },
              ],
        };
      });
    },
    setReminderOption: (noticeId, reminderOption) => {
      updateSnapshot((current) => ({
        ...current,
        bookmarks: current.bookmarks.map((bookmark) =>
          bookmark.noticeId === noticeId ? { ...bookmark, reminderOption } : bookmark,
        ),
      }));
    },
    markNoticeRead: (noticeId) => {
      const relatedNotificationIds = [`new-${noticeId}`, `keyword-${noticeId}`, `deadline-${noticeId}`];
      const hasReadNotice = snapshot.readNoticeIds.includes(noticeId);
      const hasReadNotifications = relatedNotificationIds.every((id) =>
        snapshot.readNotificationIds.includes(id),
      );

      if (hasReadNotice && hasReadNotifications) {
        return;
      }

      updateSnapshot((current) => ({
        ...current,
        readNoticeIds: current.readNoticeIds.includes(noticeId)
          ? current.readNoticeIds
          : [...current.readNoticeIds, noticeId],
        readNotificationIds: Array.from(
          new Set([...current.readNotificationIds, ...relatedNotificationIds]),
        ),
      }));
    },
    markNotificationRead: (notificationId) => {
      if (snapshot.readNotificationIds.includes(notificationId)) {
        return;
      }
      updateSnapshot((current) => ({
        ...current,
        readNotificationIds: [...current.readNotificationIds, notificationId],
      }));
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
