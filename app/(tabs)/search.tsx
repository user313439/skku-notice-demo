import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { EmptyState } from '@/src/components/EmptyState';
import { FilterSelect, type FilterSelectOption } from '@/src/components/FilterSelect';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { NoticeCard } from '@/src/components/NoticeCard';
import { suggestedKeywords } from '@/src/data/suggestedKeywords';
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

const readOptions: Array<FilterSelectOption<'all' | 'unread' | 'read'>> = [
  { label: '전체', value: 'all' },
  { label: '안 읽음', value: 'unread' },
  { label: '읽음', value: 'read' },
];

const bookmarkOptions: Array<FilterSelectOption<'all' | 'bookmarked' | 'notBookmarked'>> = [
  { label: '전체', value: 'all' },
  { label: '저장한 공지', value: 'bookmarked' },
  { label: '아직 저장 안 함', value: 'notBookmarked' },
];

const koreanInitials = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

function toInitials(text: string) {
  return Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) {
        return char;
      }
      return koreanInitials[Math.floor(code / 588)] ?? char;
    })
    .join('');
}

function matchesSuggestion(term: string, query: string) {
  const normalizedTerm = term.toLowerCase();
  const termInitials = toInitials(term);
  const normalizedTokens = normalizedTerm.split(/[\s()[\]{}:,"'·\/\\-]+/).filter(Boolean);
  const initialTokens = termInitials.split(/[\s()[\]{}:,"'·\/\\-]+/).filter(Boolean);

  if (koreanInitials.includes(query)) {
    return initialTokens.some((token) => token.startsWith(query));
  }

  if (/^[a-z0-9]+$/.test(query)) {
    return normalizedTokens.some((token) => token.startsWith(query));
  }

  return (
    normalizedTerm.startsWith(query) ||
    termInitials.startsWith(query)
  );
}

export default function SearchScreen() {
  const { resetScroll } = useLocalSearchParams<{ resetScroll?: string }>();
  const {
    notices,
    academicUnits,
    readNoticeIds,
    bookmarks,
    bookmarkMap,
    toggleBookmark,
    preferences,
  } = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('전체');
  const [unitNames, setUnitNames] = useState<string[]>([]);
  const [readStatus, setReadStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [bookmarkStatus, setBookmarkStatus] = useState<'all' | 'bookmarked' | 'notBookmarked'>('all');
  const [deadlineStatus, setDeadlineStatus] = useState<'all' | DeadlineStatus>('all');
  const [showAllUnits, setShowAllUnits] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedUnitIds = new Set(preferences.selectedUnitIds);
  const selectedCollegeIds = new Set(
    academicUnits
      .filter((unit) => unit.kind === 'college' && selectedUnitIds.has(unit.id))
      .map((unit) => unit.id),
  );
  const preferredUnits = academicUnits.filter(
    (unit) => selectedUnitIds.has(unit.id) || (unit.collegeId && selectedCollegeIds.has(unit.collegeId)),
  );
  const preferredUnitNames = new Set(preferredUnits.map((unit) => unit.name));
  const visibleUnits = showAllUnits
    ? [...preferredUnits, ...academicUnits.filter((unit) => !preferredUnitNames.has(unit.name))]
    : preferredUnits;

  const unitOptions: Array<FilterSelectOption<string>> = [
    { label: '전체', value: 'all' },
    ...visibleUnits.map((unit) => ({
      label: unit.name,
      value: unit.name,
    })),
  ];
  const unitValueLabel =
    unitNames.length === 0
      ? '전체'
      : unitNames.length === 1
        ? unitNames[0]
        : `${unitNames[0]} 외 ${unitNames.length - 1}개`;
  const readValueLabel = readOptions.find((option) => option.value === readStatus)?.label ?? '전체';
  const bookmarkValueLabel = bookmarkOptions.find((option) => option.value === bookmarkStatus)?.label ?? '전체';
  const deadlineValueLabel = deadlineFilters.find((option) => option.value === deadlineStatus)?.label ?? '전체';
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const queryReady = trimmedQuery.length > 0;
  const activeFilterLabels = [
    category !== '전체' ? category : null,
    unitNames.length ? unitValueLabel : null,
    readStatus !== 'all' ? readValueLabel : null,
    bookmarkStatus !== 'all' ? bookmarkValueLabel : null,
    deadlineStatus !== 'all' ? deadlineValueLabel : null,
  ].filter(Boolean);
  const filterSummaryText = activeFilterLabels.length
    ? activeFilterLabels.join(' · ')
    : '추가 조건 없음';
  const hasActiveFilter =
    queryReady ||
    category !== '전체' ||
    unitNames.length > 0 ||
    readStatus !== 'all' ||
    bookmarkStatus !== 'all' ||
    deadlineStatus !== 'all';
  const canRunSearch = hasActiveFilter;
  const canReset = hasActiveFilter || hasSearched;

  const suggestionCandidates = useMemo(() => {
    const titleTerms = notices.flatMap((notice) =>
      notice.title
        .split(/[\s()[\]{}:,"'·\/\\]+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2),
    );
    const tagTerms = notices.flatMap((notice) => notice.tags);
    return Array.from(new Set([...suggestedKeywords, ...tagTerms, ...titleTerms])).slice(0, 140);
  }, [notices]);

  const searchSuggestions = useMemo(() => {
    if (!queryReady) {
      return suggestedKeywords.slice(0, 10);
    }

    return suggestionCandidates
      .filter((term) => matchesSuggestion(term, normalizedQuery))
      .slice(0, 8);
  }, [normalizedQuery, queryReady, suggestionCandidates]);

  const clearFilters = () => {
    setQuery('');
    setCategory('전체');
    setUnitNames([]);
    setReadStatus('all');
    setBookmarkStatus('all');
    setDeadlineStatus('all');
    setOpenFilter(null);
    setHasSearched(false);
    setFiltersExpanded(true);
  };

  const runSearch = () => {
    setOpenFilter(null);
    if (canRunSearch) {
      setFiltersExpanded(false);
    }
    setHasSearched(canRunSearch);
  };

  const results = useMemo(
    () =>
      filterNotices(
        notices,
        { query, category, unitNames, readStatus, bookmarkStatus, deadlineStatus },
        readNoticeIds,
        bookmarks,
      ),
    [notices, query, category, unitNames, readStatus, bookmarkStatus, deadlineStatus, readNoticeIds, bookmarks],
  );
  const visibleResults = hasSearched && canRunSearch ? results : [];

  return (
    <AppShell scrollToTopSignal={resetScroll}>
      <View style={styles.header}>
        <Text style={styles.title}>검색</Text>
        {hasSearched && canRunSearch ? <Text style={styles.count}>{results.length}건</Text> : null}
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
            <Text style={styles.panelTitle}>조건 설정</Text>
          </View>
          <View style={styles.panelActions}>
            <Pressable
              onPress={() => {
                setOpenFilter(null);
                setFiltersExpanded((current) => !current);
              }}
              style={styles.toggleFilterButton}>
              <Text style={styles.toggleFilterText}>{filtersExpanded ? '접기' : '열기'}</Text>
              <Ionicons
                name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
                size={15}
                color={colors.primary}
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.filterLabel}>검색어</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setHasSearched(false);
            }}
            onSubmitEditing={runSearch}
            placeholder="제목, 본문, 태그 검색"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Pressable
            disabled={!canRunSearch}
            onPress={runSearch}
            style={[styles.searchButton, !canRunSearch && styles.searchButtonDisabled]}>
            <Text style={styles.searchButtonText}>검색</Text>
          </Pressable>
        </View>

        {!hasSearched && searchSuggestions.length ? (
          <View style={styles.suggestionBlock}>
            <Text style={styles.suggestionTitle}>추천 검색어</Text>
            <View style={styles.suggestionRow}>
              {searchSuggestions.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    setQuery(item);
                    setHasSearched(false);
                  }}
                  style={styles.suggestionChip}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <Pressable
          disabled={!canReset}
          onPress={clearFilters}
          style={[styles.resetInlineButton, !canReset && styles.resetInlineButtonDisabled]}>
          <Ionicons name="refresh-outline" size={15} color={canReset ? colors.primary : colors.textMuted} />
          <Text style={[styles.resetText, !canReset && styles.resetTextDisabled]}>필터 초기화</Text>
        </Pressable>

        {filtersExpanded ? (
          <>
            <Text style={styles.filterLabel}>카테고리</Text>
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

            <FilterSelect
              label="Academic Unit"
              valueLabel={unitValueLabel}
              options={unitOptions}
              selectedValues={unitNames}
              open={openFilter === 'unit'}
              onToggle={() => setOpenFilter((current) => (current === 'unit' ? null : 'unit'))}
              onSelect={(value) => {
                setUnitNames((current) => {
                  if (value === 'all') {
                    return [];
                  }
                  return current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value];
                });
              }}
            />
            <Pressable onPress={() => setShowAllUnits((current) => !current)} style={styles.expandUnitsButton}>
              <Ionicons name={showAllUnits ? 'remove-circle-outline' : 'add-circle-outline'} size={16} color={colors.primary} />
              <Text style={styles.expandUnitsText}>
                {showAllUnits ? '관심 학과만 보기' : '다른 학과도 검색하기'}
              </Text>
            </Pressable>

            <FilterSelect
              label="읽음 상태"
              valueLabel={readValueLabel}
              options={readOptions}
              open={openFilter === 'read'}
              onToggle={() => setOpenFilter((current) => (current === 'read' ? null : 'read'))}
              onSelect={(value) => {
                setReadStatus(value);
                setOpenFilter(null);
              }}
            />

            <FilterSelect
              label="저장함"
              valueLabel={bookmarkValueLabel}
              options={bookmarkOptions}
              open={openFilter === 'bookmark'}
              onToggle={() => setOpenFilter((current) => (current === 'bookmark' ? null : 'bookmark'))}
              onSelect={(value) => {
                setBookmarkStatus(value);
                setOpenFilter(null);
              }}
            />

            <FilterSelect
              label="마감 상태"
              valueLabel={deadlineValueLabel}
              options={deadlineFilters}
              open={openFilter === 'deadline'}
              onToggle={() => setOpenFilter((current) => (current === 'deadline' ? null : 'deadline'))}
              onSelect={(value) => {
                setDeadlineStatus(value);
                setOpenFilter(null);
              }}
            />
          </>
        ) : (
          <Text style={styles.filterSummary}>{filterSummaryText}</Text>
        )}
      </View>

      {visibleResults.length ? (
        visibleResults.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            read={readNoticeIds.includes(notice.id)}
            bookmark={bookmarkMap[notice.id]}
            highlightKeywords={preferences.keywords}
            onPress={() => router.push(`/notice/${notice.id}`)}
            onBookmarkPress={() => toggleBookmark(notice.id)}
          />
        ))
      ) : hasSearched ? (
        <EmptyState title="검색 결과가 없습니다" body="키워드 또는 필터 조건을 조금 넓혀보세요." />
      ) : !canRunSearch ? (
        <EmptyState title="표시할 결과가 없습니다" />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  filterPanel: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
    marginBottom: 14,
  },
  panelHeader: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  panelActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resetButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 11,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: colors.faint,
  },
  resetText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  resetTextDisabled: {
    color: colors.textMuted,
  },
  resetInlineButton: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 11,
    marginBottom: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  resetInlineButtonDisabled: {
    borderColor: colors.border,
    backgroundColor: colors.faint,
  },
  toggleFilterButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: colors.faint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  toggleFilterText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  filterSummary: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  filterLabel: {
    marginBottom: 7,
    color: colors.text,
    fontSize: 12,
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
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.45,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  suggestionBlock: {
    marginTop: -2,
    marginBottom: 12,
  },
  suggestionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 15,
    backgroundColor: colors.faint,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  suggestionText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  rail: {
    marginBottom: 14,
  },
  railLast: {
    marginBottom: 0,
  },
  railContent: {
    paddingRight: 28,
  },
  expandUnitsButton: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    marginTop: -2,
    marginBottom: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  expandUnitsText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  filterButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  filterTextSelected: {
    color: colors.white,
  },
});
