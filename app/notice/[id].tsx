import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { DDayBadge } from '@/src/components/DDayBadge';
import { EmptyState } from '@/src/components/EmptyState';
import { explainClassification } from '@/src/services/mockClassifier';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';
import type { ReminderOption } from '@/src/types';
import { formatDateWithWeekdayKo } from '@/src/utils/dateUtils';

const reminderOptions: Array<{ label: string; value: ReminderOption }> = [
  { label: '알림 없음', value: 'none' },
  { label: '1일 전', value: '1d' },
  { label: '3일 전', value: '3d' },
  { label: '7일 전', value: '7d' },
];

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    notices,
    bookmarkMap,
    toggleBookmark,
    setReminderOption,
    markNoticeRead,
    readNoticeIds,
  } = useAppState();
  const [feedback, setFeedback] = useState('');
  const notice = notices.find((item) => item.id === id);

  useEffect(() => {
    if (notice) {
      markNoticeRead(notice.id);
    }
  }, [notice, markNoticeRead]);

  if (!notice) {
    return (
      <AppShell>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <EmptyState title="공지 정보를 찾을 수 없습니다" body="목 데이터에 없는 공지입니다." />
      </AppShell>
    );
  }

  const bookmarked = Boolean(bookmarkMap[notice.id]);
  const currentReminder = bookmarkMap[notice.id]?.reminderOption ?? 'none';
  const read = readNoticeIds.includes(notice.id);
  const confidencePercent = Math.round(notice.classificationConfidence * 100);
  const summaryText = notice.summary ?? notice.content;

  const handleBookmark = () => {
    toggleBookmark(notice.id);
    setFeedback(bookmarked ? '즐겨찾기에서 해제했습니다.' : '즐겨찾기에 저장했습니다.');
    setTimeout(() => setFeedback(''), 1400);
  };

  const openOriginal = async () => {
    try {
      await Linking.openURL(notice.originalUrl);
    } catch {
      Alert.alert('원문 링크', notice.originalUrl);
    }
  };

  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <Pressable onPress={handleBookmark} style={styles.headerIconButton}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={23}
            color={bookmarked ? colors.gold : colors.text}
          />
        </Pressable>
      </View>

      {feedback ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <View style={styles.hero}>
        <View style={styles.badgeRow}>
          <DDayBadge notice={notice} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{notice.category}</Text>
          </View>
          <View style={styles.readBadge}>
            <Text style={styles.readBadgeText}>{read ? '읽음' : '안 읽음'}</Text>
          </View>
        </View>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.source}>{notice.sourceUnit} · {notice.sourceBoard}</Text>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>게시일</Text>
          <Text style={styles.metaValue}>{formatDateWithWeekdayKo(notice.publishedAt)}</Text>
        </View>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>마감일</Text>
          <Text style={styles.metaValue}>{formatDateWithWeekdayKo(notice.deadlineAt)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>원문 기준 마감 안내</Text>
        <Text style={styles.sectionBody}>{notice.rawDeadlineText}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>요약된 공지 내용</Text>
        <Text style={styles.sectionBody}>{summaryText}</Text>
      </View>

      {notice.attachmentTitle ? (
        <View style={styles.attachmentCard}>
          <View style={styles.attachmentPreview}>
            <Ionicons name="image-outline" size={30} color={colors.primary} />
            <Text style={styles.attachmentPreviewText}>첨부</Text>
          </View>
          <View style={styles.attachmentBody}>
            <Text style={styles.attachmentTitle}>{notice.attachmentTitle}</Text>
            <Text style={styles.attachmentText}>{notice.attachmentDescription}</Text>
            <Text style={styles.attachmentHint}>원문 링크에서 실제 첨부 자료를 확인할 수 있습니다.</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.reminderSection}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderIconCircle}>
            <Ionicons name="notifications-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.reminderTextBlock}>
            <Text style={styles.reminderTitle}>마감 알림 설정</Text>
            <Text style={styles.reminderCaption}>
              저장한 공지는 원하는 시점에 마감 알림을 받을 수 있습니다.
            </Text>
          </View>
        </View>
        {bookmarked ? (
          <View style={styles.reminderOptionRow}>
            {reminderOptions.map((option) => {
              const selected = currentReminder === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setReminderOption(notice.id, option.value)}
                  style={[styles.reminderOption, selected && styles.reminderOptionSelected]}>
                  <Text
                    style={[
                      styles.reminderOptionText,
                      selected && styles.reminderOptionTextSelected,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Pressable onPress={handleBookmark} style={styles.saveReminderButton}>
            <Ionicons name="bookmark-outline" size={17} color={colors.primary} />
            <Text style={styles.saveReminderText}>저장하고 알림 설정하기</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.tagRow}>
        {notice.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.classificationNote}>
        <Ionicons name="sparkles-outline" size={15} color={colors.textMuted} />
        <View style={styles.classificationTextBlock}>
          <Text style={styles.classificationTitle}>
            자동 분류: {notice.category} · 신뢰도 {confidencePercent}%
          </Text>
          <Text style={styles.classificationBody}>{explainClassification(notice)}</Text>
        </View>
      </View>

      <Pressable onPress={openOriginal} style={styles.originalButton}>
        <Ionicons name="open-outline" size={19} color={colors.white} />
        <Text style={styles.originalButtonText}>원문 링크 열기</Text>
      </Pressable>
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
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
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
  hero: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  categoryBadge: {
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  readBadge: {
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.faint,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  readBadgeText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '900',
  },
  source: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 10,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 13,
  },
  metaLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  metaValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  section: {
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  sectionBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  attachmentCard: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 13,
    flexDirection: 'row',
    gap: 12,
  },
  attachmentPreview: {
    width: 82,
    minHeight: 96,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  attachmentPreviewText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  attachmentBody: {
    flex: 1,
  },
  attachmentTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  attachmentText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  attachmentHint: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  reminderSection: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextBlock: {
    flex: 1,
  },
  reminderTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  reminderCaption: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  reminderOptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  reminderOption: {
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  reminderOptionText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  reminderOptionTextSelected: {
    color: colors.primary,
    fontWeight: '900',
  },
  saveReminderButton: {
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
  },
  saveReminderText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    borderRadius: 14,
    backgroundColor: colors.faint,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  classificationNote: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#F6F8F6',
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  classificationTextBlock: {
    flex: 1,
  },
  classificationTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  classificationBody: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  originalButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  originalButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
