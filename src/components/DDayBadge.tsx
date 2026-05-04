import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import type { Notice } from '@/src/types';
import { getDDayLabel, getDeadlineStatus, getDeadlineTone } from '@/src/utils/dday';

export function DDayBadge({ notice }: { notice: Notice }) {
  const status = getDeadlineStatus(notice.deadlineAt, notice.rawDeadlineText);
  const tone = getDeadlineTone(status, notice.deadlineAt);

  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.label, styles[`${tone}Text`]]}>
        {getDDayLabel(notice.deadlineAt, notice.rawDeadlineText)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 66,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    backgroundColor: '#FFF3E9',
  },
  urgent: {
    backgroundColor: '#FEE2E2',
  },
  closed: {
    backgroundColor: '#F3F4F6',
  },
  success: {
    backgroundColor: '#DCFCE7',
  },
  neutral: {
    backgroundColor: colors.faint,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
  warningText: {
    color: colors.warning,
  },
  urgentText: {
    color: colors.danger,
  },
  closedText: {
    color: colors.textMuted,
  },
  successText: {
    color: '#15803D',
  },
  neutralText: {
    color: colors.textMuted,
  },
});
