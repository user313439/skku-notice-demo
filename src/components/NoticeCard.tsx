import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import type { BookmarkSetting, Notice } from '@/src/types';
import { formatDateKo, formatRelativePublished } from '@/src/utils/dateUtils';
import { DDayBadge } from './DDayBadge';

interface NoticeCardProps {
  notice: Notice;
  read: boolean;
  bookmark?: BookmarkSetting;
  onPress: () => void;
  onBookmarkPress: () => void;
}

export function NoticeCard({
  notice,
  read,
  bookmark,
  onPress,
  onBookmarkPress,
}: NoticeCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, read && styles.readCard]}>
      <View style={styles.topRow}>
        <View style={styles.leftBadges}>
          <DDayBadge notice={notice} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{notice.category}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmark ? '북마크 해제' : '북마크 추가'}
          onPress={onBookmarkPress}
          hitSlop={10}
          style={styles.bookmarkButton}>
          <Ionicons
            name={bookmark ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmark ? colors.gold : colors.textMuted}
          />
        </Pressable>
      </View>
      <View style={styles.titleRow}>
        {!read ? <View style={styles.unreadDot} /> : null}
        <Text style={[styles.title, read && styles.readTitle]} numberOfLines={2}>
          {notice.title}
        </Text>
      </View>
      <Text style={styles.content} numberOfLines={2}>
        {notice.content}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{notice.sourceUnit}</Text>
        <Text style={styles.meta}>{formatDateKo(notice.publishedAt)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.subMeta}>{notice.sourceBoard}</Text>
        <Text style={styles.subMeta}>{formatRelativePublished(notice.publishedAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECE8',
  },
  readCard: {
    opacity: 0.64,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '800',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
    marginTop: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    color: colors.text,
  },
  readTitle: {
    color: colors.textMuted,
  },
  content: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  subMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
