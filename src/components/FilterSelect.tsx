import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';

export interface FilterSelectOption<T extends string> {
  label: string;
  value: T;
  caption?: string;
}

interface FilterSelectProps<T extends string> {
  label: string;
  valueLabel: string;
  options: FilterSelectOption<T>[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
}

export function FilterSelect<T extends string>({
  label,
  valueLabel,
  options,
  open,
  onToggle,
  onSelect,
}: FilterSelectProps<T>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.control}>
        <Text style={styles.value} numberOfLines={1}>{valueLabel}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>
      {open ? (
        <View style={styles.menu}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.menuScroll}>
            {options.map((option) => {
              const selected = option.label === valueLabel;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  style={[styles.option, selected && styles.selectedOption]}>
                  <View style={styles.optionTextBlock}>
                    <Text style={[styles.optionLabel, selected && styles.selectedOptionLabel]}>
                      {option.label}
                    </Text>
                    {option.caption ? (
                      <Text style={styles.optionCaption} numberOfLines={1}>{option.caption}</Text>
                    ) : null}
                  </View>
                  {selected ? <Ionicons name="checkmark" size={17} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 7,
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  control: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  menu: {
    marginTop: 7,
    maxHeight: 244,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FBFDFC',
    overflow: 'hidden',
  },
  menuScroll: {
    maxHeight: 244,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.secondary,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  selectedOptionLabel: {
    color: colors.primary,
  },
  optionCaption: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
});
