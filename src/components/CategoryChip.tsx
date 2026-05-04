import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/src/theme/colors';
import type { NoticeCategory } from '@/src/types';

export function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: NoticeCategory | string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedLabel: {
    color: colors.white,
  },
});
