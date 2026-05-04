import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { EmptyState } from '@/src/components/EmptyState';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { NoticeCard } from '@/src/components/NoticeCard';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';
import type { DeadlineStatus, NoticeCategory } from '@/src/types';
import { filterNotices } from '@/src/utils/noticeFilters';

const categories: NoticeCategory[] = ['전체', '학사', '장학', '취업', '행사/세미나', '모집', '일반'];
const deadlineFilters: Array<{ label: string; value: 'all' | DeadlineStatus }> = [
  { label: '전체', value: 'all' },
  { label: '임박', value: 'upcoming' },
  { label: 'D-Day', value: 'today' },
  { label: '마감', value: 'closed' },
  { label: '상시', value: 'always' },
  { label: '일정 없음', value: 'none' },
];

export default function SearchScreen() {
  const { resetScroll } = useLocalSearchParams<{ resetScroll?: string }>();
  const {
    notices,
    academicUnits,
    readNoticeIds,
    bookmarks,
    bookmarkMap,
    toggleBookmark,
  } = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('전체');
  const [unitName, setUnitName] = useState<string | undefined>();
  const [readStatus, setReadStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [deadlineStatus, setDeadlineStatus] = useState<'all' | DeadlineStatus>('all');

  const results = useMemo(
    () =>
      filterNotices(
        notices,
        { query, category, unitName, readStatus, bookmarkOnly, deadlineStatus },
        readNoticeIds,
        bookmarks,
      ),
    [notices, query, category, unitName, readStatus, bookmarkOnly, deadlineStatus, readNoticeIds, bookmarks],
  );

  return (
    <AppShell scrollToTopSignal={resetScroll}>
      <View style={styles.header}>
        <Text style={styles.title}>검색 / 필터</Text>
        <Text style={styles.count}>{results.length}건</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="제목, 본문, 태그 검색"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <HorizontalRail contentContainerStyle={styles.railContent} style={styles.rail}>
        {categories.map((item) => (
          <CategoryChip
            key={item}
            label={item}
            selected={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </HorizontalRail>

      <HorizontalRail contentContainerStyle={styles.railContent} style={styles.rail}>
        <CategoryChip
          label="모든 학과"
          selected={!unitName}
          onPress={() => setUnitName(undefined)}
        />
        {academicUnits.map((unit) => (
          <CategoryChip
            key={unit.id}
            label={unit.shortName}
            selected={unitName === unit.name}
            onPress={() => setUnitName(unit.name)}
          />
        ))}
      </HorizontalRail>

      <View style={styles.filterGrid}>
        {(['all', 'unread', 'read'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setReadStatus(item)}
            style={[styles.filterButton, readStatus === item && styles.filterButtonSelected]}>
            <Text style={[styles.filterText, readStatus === item && styles.filterTextSelected]}>
              {item === 'all' ? '읽음 전체' : item === 'unread' ? '안 읽음' : '읽음'}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setBookmarkOnly((current) => !current)}
          style={[styles.filterButton, bookmarkOnly && styles.filterButtonSelected]}>
          <Text style={[styles.filterText, bookmarkOnly && styles.filterTextSelected]}>
            즐겨찾기
          </Text>
        </Pressable>
      </View>

      <HorizontalRail contentContainerStyle={styles.railContent} style={styles.rail}>
        {deadlineFilters.map((item) => (
          <CategoryChip
            key={item.value}
            label={item.label}
            selected={deadlineStatus === item.value}
            onPress={() => setDeadlineStatus(item.value)}
          />
        ))}
      </HorizontalRail>

      {results.length ? (
        results.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            read={readNoticeIds.includes(notice.id)}
            bookmark={bookmarkMap[notice.id]}
            onPress={() => router.push(`/notice/${notice.id}`)}
            onBookmarkPress={() => toggleBookmark(notice.id)}
          />
        ))
      ) : (
        <EmptyState title="검색 결과가 없습니다" body="키워드 또는 필터 조건을 조금 넓혀보세요." />
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
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },
  count: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  searchBox: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  rail: {
    marginBottom: 12,
  },
  railContent: {
    paddingRight: 28,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  filterTextSelected: {
    color: colors.primary,
  },
});
