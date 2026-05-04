import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/src/theme/colors';

interface HorizontalRailProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  step?: number;
}

export function HorizontalRail({
  children,
  style,
  contentContainerStyle,
  step = 180,
}: HorizontalRailProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [offsetX, setOffsetX] = useState(0);

  const scrollBy = (delta: number) => {
    const nextOffset = Math.max(0, offsetX + delta);
    setOffsetX(nextOffset);
    scrollRef.current?.scrollTo({ x: nextOffset, animated: true });
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="왼쪽으로 이동"
        onPress={() => scrollBy(-step)}
        style={[styles.arrowButton, offsetX <= 0 && styles.arrowButtonMuted]}>
        <Ionicons name="chevron-back" size={16} color={offsetX <= 0 ? colors.textMuted : colors.primary} />
      </Pressable>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => setOffsetX(event.nativeEvent.contentOffset.x)}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        style={styles.scroll}>
        {children}
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="오른쪽으로 이동"
        onPress={() => scrollBy(step)}
        style={styles.arrowButton}>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingRight: 8,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonMuted: {
    backgroundColor: colors.faint,
  },
});
