import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { EmptyState } from '@/src/components/EmptyState';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { NoticeCard } from '@/src/components/NoticeCard';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';
import type { DeadlineStatus, NoticeCategory } from '@/src/types';
import { filterNotices, sortByDeadline } from '@/src/utils/noticeFilters';

const categories: NoticeCategory[] = ['전체', '학사', '장학', '취업', '행사/세미나', '모집', '일반'];

export default function HomeScreen() {
  const {
    notices,
    academicUnits,
    selectedUnitNames,
    readNoticeIds,
    bookmarks,
    bookmarkMap,
    toggleBookmark,
    toggleNotifications,
    preferences,
  } = useAppState();
  const [activeScopeId, setActiveScopeId] = useState('all');
  const [unitRailExpanded, setUnitRailExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>('전체');
  const [sortMode, setSortMode] = useState<'latest' | 'deadline'>('latest');
  const [deadlineStatus, setDeadlineStatus] = useState<'all' | Extract<DeadlineStatus, 'closed'>>('all');
  const [feedback, setFeedback] = useState('');

  const feedScopeOptions = useMemo(() => {
    const selectedIds = new Set(preferences.selectedUnitIds);

    return academicUnits
      .filter((unit) => selectedIds.has(unit.id))
      .map((unit) => {
        const childSourceNames =
          unit.kind === 'college'
            ? academicUnits
                .filter((child) => child.collegeId === unit.id)
                .map((child) => child.name)
            : [];

        return {
          id: unit.id,
          label: unit.kind === 'college' ? `${unit.shortName ?? unit.name} 전체` : unit.shortName ?? unit.name,
          fullLabel: unit.name,
          sourceNames: Array.from(new Set([unit.name, ...childSourceNames])),
        };
      });
  }, [academicUnits, preferences.selectedUnitIds]);

  const activeScope = feedScopeOptions.find((scope) => scope.id === activeScopeId);
  const activeSourceNames = activeScope ? activeScope.sourceNames : selectedUnitNames;

  useEffect(() => {
    if (activeScopeId !== 'all' && !feedScopeOptions.some((scope) => scope.id === activeScopeId)) {
      setActiveScopeId('all');
    }
  }, [activeScopeId, feedScopeOptions]);

  const feedNotices = useMemo(() => {
    const selected = notices.filter((notice) => activeSourceNames.includes(notice.sourceUnit));
    const filtered = filterNotices(
      selected,
      { category: selectedCategory, deadlineStatus },
      readNoticeIds,
      bookmarks,
    );
    if (sortMode === 'deadline') {
      return sortByDeadline(filtered);
    }
    return [...filtered].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [
    notices,
    activeSourceNames,
    selectedCategory,
    sortMode,
    deadlineStatus,
    readNoticeIds,
    bookmarks,
  ]);

  const baseFeedNotices = useMemo(
    () => notices.filter((notice) => activeSourceNames.includes(notice.sourceUnit)),
    [notices, activeSourceNames],
  );
  const unreadCount = baseFeedNotices.filter((notice) => !readNoticeIds.includes(notice.id)).length;
  const closedCount = baseFeedNotices.filter((notice) => {
    if (!notice.deadlineAt) {
      return false;
    }
    return new Date(`${notice.deadlineAt.slice(0, 10)}T00:00:00`).getTime() < new Date().setHours(0, 0, 0, 0);
  }).length;
  const bookmarkIds = new Set(bookmarks.map((bookmark) => bookmark.noticeId));
  const bookmarkCount = notices.filter((notice) => bookmarkIds.has(notice.id)).length;
  const selectedLabel = activeScope ? activeScope.fullLabel : '전체 구독 피드';

  const handleBookmark = (noticeId: string) => {
    const exists = Boolean(bookmarkMap[noticeId]);
    toggleBookmark(noticeId);
    setFeedback(exists ? '즐겨찾기에서 해제했습니다.' : '즐겨찾기에 저장했습니다.');
    setTimeout(() => setFeedback(''), 1400);
  };

  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => setUnitRailExpanded((current) => !current)} style={styles.unitButton}>
          <Text style={styles.unitText} numberOfLines={1}>
            {selectedLabel}
          </Text>
          <Ionicons name={unitRailExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/search', params: { resetScroll: Date.now().toString() } })
          }
          style={styles.iconButton}>
          <Ionicons name="search" size={23} color={colors.text} />
        </Pressable>
      </View>

      {unitRailExpanded ? (
        <HorizontalRail contentContainerStyle={styles.unitRailContent} style={styles.unitRail}>
          <CategoryChip
            label="전체 구독"
            selected={activeScopeId === 'all'}
            onPress={() => setActiveScopeId('all')}
          />
          {feedScopeOptions.map((scope) => (
            <CategoryChip
              key={scope.id}
              label={scope.label}
              selected={activeScopeId === scope.id}
              onPress={() => setActiveScopeId(scope.id)}
            />
          ))}
        </HorizontalRail>
      ) : null}

      <View style={styles.summaryCard}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/unread',
              params: { sources: activeSourceNames.join('|'), title: selectedLabel },
            })
          }
          style={styles.summaryMain}>
          <Text style={styles.summaryLabel}>읽지 않은 공지</Text>
          <Text style={styles.summaryTitle}>{unreadCount}건</Text>
        </Pressable>
        <Pressable onPress={toggleNotifications} style={styles.summaryPill}>
          <Ionicons name={preferences.notificationsEnabled ? 'notifications' : 'notifications-off'} size={15} color={colors.primary} />
          <Text style={styles.summaryPillText}>
            {preferences.notificationsEnabled ? '알림 ON' : '알림 OFF'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable onPress={() => router.push('/bookmarks')} style={styles.actionCard}>
          <View style={styles.actionIconCircle}>
            <Ionicons name="bookmark" size={18} color={colors.gold} />
          </View>
          <View style={styles.actionTextBlock}>
            <Text style={styles.actionTitle}>저장함</Text>
            <Text style={styles.actionCaption}>{bookmarkCount}개 공지</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => {
            setDeadlineStatus((current) => (current === 'closed' ? 'all' : 'closed'));
          }}
          style={[styles.actionCard, deadlineStatus === 'closed' && styles.actionCardActive]}>
          <View style={[styles.actionIconCircle, styles.closedIconCircle]}>
            <Ionicons name="calendar-clear-outline" size={18} color={colors.textMuted} />
          </View>
          <View style={styles.actionTextBlock}>
            <Text style={styles.actionTitle}>지난 일정</Text>
            <Text style={styles.actionCaption}>{closedCount}개 마감</Text>
          </View>
        </Pressable>
      </View>

      {feedback ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <HorizontalRail contentContainerStyle={styles.categoryContent} style={styles.categoryRail}>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </HorizontalRail>

      <View style={styles.sortRow}>
        <Pressable
          onPress={() => setSortMode('latest')}
          style={[styles.sortButton, sortMode === 'latest' && styles.sortButtonSelected]}>
          <Text style={[styles.sortText, sortMode === 'latest' && styles.sortTextSelected]}>
            최신순
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSortMode('deadline')}
          style={[styles.sortButton, sortMode === 'deadline' && styles.sortButtonSelected]}>
          <Text style={[styles.sortText, sortMode === 'deadline' && styles.sortTextSelected]}>
            마감임박순
          </Text>
        </Pressable>
        {deadlineStatus === 'closed' ? (
          <Pressable onPress={() => setDeadlineStatus('all')} style={styles.activeFilterButton}>
            <Text style={styles.activeFilterText}>지난 일정</Text>
            <Ionicons name="close" size={13} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      {feedNotices.length ? (
        feedNotices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            read={readNoticeIds.includes(notice.id)}
            bookmark={bookmarkMap[notice.id]}
            onPress={() => router.push(`/notice/${notice.id}`)}
            onBookmarkPress={() => handleBookmark(notice.id)}
          />
        ))
      ) : (
        <EmptyState
          title="표시할 공지가 없습니다"
          body="프로필 또는 설정에서 관심 학과를 추가하면 피드가 바로 갱신됩니다."
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  unitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unitText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
    maxWidth: 285,
  },
  unitRail: {
    marginHorizontal: -2,
    marginBottom: 10,
  },
  unitRailContent: {
    paddingHorizontal: 2,
    paddingRight: 28,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryMain: {
    flex: 1,
  },
  summaryLabel: {
    color: '#CFE1D7',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  summaryPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  feedback: {
    borderRadius: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  feedbackText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  categoryRail: {
    marginHorizontal: -2,
    marginBottom: 12,
  },
  categoryContent: {
    paddingHorizontal: 2,
    paddingRight: 28,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sortButton: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 13,
    flexDirection: 'row',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  sortButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  activeFilterButton: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.secondary,
  },
  activeFilterText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    minHeight: 62,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  actionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  actionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedIconCircle: {
    backgroundColor: colors.faint,
  },
  actionTextBlock: {
    flex: 1,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  actionCaption: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  sortText: {
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: 12,
  },
  sortTextSelected: {
    color: colors.primary,
  },
});
