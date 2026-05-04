import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { EmptyState } from '@/src/components/EmptyState';
import { NoticeCard } from '@/src/components/NoticeCard';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';
import type { ReminderOption } from '@/src/types';
import { daysUntil } from '@/src/utils/dateUtils';
import { sortByDeadline } from '@/src/utils/noticeFilters';

const reminderOptions: Array<{ label: string; value: ReminderOption }> = [
  { label: '알림 없음', value: 'none' },
  { label: '1일 전', value: '1d' },
  { label: '3일 전', value: '3d' },
  { label: '7일 전', value: '7d' },
];

export default function BookmarksScreen() {
  const {
    notices,
    bookmarks,
    bookmarkMap,
    readNoticeIds,
    toggleBookmark,
    setReminderOption,
  } = useAppState();

  const bookmarkedNotices = useMemo(() => {
    const ids = new Set(bookmarks.map((bookmark) => bookmark.noticeId));
    return sortByDeadline(notices.filter((notice) => ids.has(notice.id)));
  }, [notices, bookmarks]);

  const urgentCount = bookmarkedNotices.filter((notice) => {
    if (!notice.deadlineAt) {
      return false;
    }
    const days = daysUntil(notice.deadlineAt);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.title}>즐겨찾기 / D-Day</Text>
          <Text style={styles.count}>{bookmarkedNotices.length}건</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>7일 이내 마감</Text>
          <Text style={styles.summaryValue}>{urgentCount}건</Text>
        </View>
        <Text style={styles.summaryBody}>북마크한 공지의 리마인더 옵션을 데모 상태로 저장합니다.</Text>
      </View>

      {bookmarkedNotices.length ? (
        bookmarkedNotices.map((notice) => {
          const bookmark = bookmarkMap[notice.id];
          return (
            <View key={notice.id} style={styles.itemBlock}>
              <NoticeCard
                notice={notice}
                read={readNoticeIds.includes(notice.id)}
                bookmark={bookmark}
                onPress={() => router.push(`/notice/${notice.id}`)}
                onBookmarkPress={() => toggleBookmark(notice.id)}
              />
              <View style={styles.reminderRow}>
                {reminderOptions.map((option) => {
                  const selected = bookmark?.reminderOption === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setReminderOption(notice.id, option.value)}
                      style={[styles.reminderButton, selected && styles.reminderButtonSelected]}>
                      <Text style={[styles.reminderText, selected && styles.reminderTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })
      ) : (
        <EmptyState
          title="저장된 공지가 없습니다"
          body="홈 또는 검색 화면에서 중요한 공지를 즐겨찾기에 추가해 보세요."
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 38,
  },
  backText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  headerTitleBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },
  count: {
    color: colors.primary,
    fontWeight: '900',
  },
  summary: {
    borderRadius: 8,
    backgroundColor: colors.secondary,
    padding: 15,
    marginBottom: 14,
  },
  summaryLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  summaryValue: {
    marginTop: 2,
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: '900',
  },
  summaryBody: {
    marginTop: 8,
    color: colors.textMuted,
    lineHeight: 20,
    fontSize: 13,
  },
  itemBlock: {
    marginBottom: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -2,
    marginBottom: 2,
  },
  reminderButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  reminderButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  reminderText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  reminderTextSelected: {
    color: colors.white,
  },
});
