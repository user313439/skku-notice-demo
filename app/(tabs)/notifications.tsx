import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { EmptyState } from '@/src/components/EmptyState';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';
import type { NotificationType } from '@/src/types';
import { formatDateWithWeekdayKo, formatRelativePublished } from '@/src/utils/dateUtils';

const typeLabels: Record<NotificationType, string> = {
  new_notice: '새 공지',
  keyword_match: '키워드',
  deadline_reminder: '마감 임박',
  system: '시스템',
};

const typeIcons: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  new_notice: 'newspaper-outline',
  keyword_match: 'sparkles-outline',
  deadline_reminder: 'alarm-outline',
  system: 'pulse-outline',
};

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useAppState();

  const unreadCount = notifications.filter((item) => !item.read).length;
  const markAllRead = () => {
    notifications.forEach((item) => markNotificationRead(item.id));
  };

  const openNotification = (id: string, noticeId?: string) => {
    markNotificationRead(id);
    if (noticeId) {
      router.push(`/notice/${noticeId}`);
    }
  };

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={styles.title}>알림 센터</Text>
        <View style={styles.headerActions}>
          <Text style={styles.count}>안 읽음 {unreadCount}건</Text>
          {unreadCount ? (
            <Pressable onPress={markAllRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>모두 읽음</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {notifications.length ? (
        notifications.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => openNotification(item.id, item.noticeId)}
            style={[styles.notification, item.read && styles.readNotification]}>
            <View style={styles.iconCircle}>
              <Ionicons name={typeIcons[item.type]} size={19} color={colors.primary} />
            </View>
            <View style={styles.notificationBody}>
              <View style={styles.notificationTop}>
                <Text style={styles.typeLabel}>{typeLabels[item.type]}</Text>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationText}>{item.body}</Text>
              <Text style={styles.notificationTime}>
                {formatRelativePublished(item.createdAt)} · {formatDateWithWeekdayKo(item.createdAt)}
              </Text>
            </View>
          </Pressable>
        ))
      ) : (
        <EmptyState title="알림이 없습니다" body="새 공지와 키워드 매칭 알림이 이곳에 표시됩니다." />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllButton: {
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  notification: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  readNotification: {
    opacity: 0.64,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBody: {
    flex: 1,
  },
  notificationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
  },
  notificationText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  notificationTime: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },
});
