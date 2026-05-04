import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

interface AppShellProps {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  scrollToTopSignal?: string | number;
}

export function AppShell({ children, scroll = true, contentStyle, scrollToTopSignal }: AppShellProps) {
  const scrollRef = useRef<ScrollView>(null);
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  useEffect(() => {
    if (scrollToTopSignal !== undefined) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [scrollToTopSignal]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phoneFrame}>
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDE7E0',
    alignItems: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D4DDD7',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    minHeight: '100%',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },
});
