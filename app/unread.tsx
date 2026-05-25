import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { EmptyState } from '@/src/components/EmptyState';
import { NoticeCard } from '@/src/components/NoticeCard';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function UnreadNoticesScreen() {
  const { sources, title } = useLocalSearchParams<{ sources?: string; title?: string }>();
  const {
    notices,
    selectedUnitNames,
    readNoticeIds,
    bookmarkMap,
    toggleBookmark,
    preferences,
  } = useAppState();

  const sourceNames = useMemo(() => {
    const rawSources = getParam(sources);
    const parsed = rawSources?.split('|').map((item) => item.trim()).filter(Boolean);
    return parsed?.length ? parsed : selectedUnitNames;
  }, [sources, selectedUnitNames]);

  const unreadNotices = useMemo(
    () =>
      notices
        .filter((notice) => sourceNames.includes(notice.sourceUnit))
        .filter((notice) => !readNoticeIds.includes(notice.id))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [notices, sourceNames, readNoticeIds],
  );

  const scopeTitle = getParam(title) ?? '전체 구독 피드';

  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <Text style={styles.count}>안 읽음 {unreadNotices.length}건</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.kicker}>읽지 않은 공지</Text>
        <Text style={styles.title}>{scopeTitle}</Text>
        <Text style={styles.body}>공지 상세에 들어가 확인한 항목은 자동으로 읽음 처리됩니다.</Text>
      </View>

      {unreadNotices.length ? (
        unreadNotices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            read={false}
            bookmark={bookmarkMap[notice.id]}
            highlightKeywords={preferences.keywords}
            onPress={() => router.push(`/notice/${notice.id}`)}
            onBookmarkPress={() => toggleBookmark(notice.id)}
          />
        ))
      ) : (
        <EmptyState
          title="읽지 않은 공지가 없습니다"
          body="새 공지가 들어오면 이 화면에서 한 번에 확인할 수 있습니다."
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  backText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  count: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  summary: {
    borderRadius: 8,
    backgroundColor: colors.primary,
    padding: 16,
    marginBottom: 14,
  },
  kicker: {
    color: '#CFE1D7',
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '900',
    marginTop: 5,
  },
  body: {
    color: '#DCE9E1',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 8,
  },
});
