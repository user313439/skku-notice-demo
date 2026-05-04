import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export default function EntryScreen() {
  const { hydrated, preferences } = useAppState();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const target = preferences.hasOnboarded ? '/home' : '/onboarding';
    const timer = setTimeout(() => router.replace(target), 650);
    return () => clearTimeout(timer);
  }, [hydrated, preferences.hasOnboarded]);

  return (
    <AppShell scroll={false} contentStyle={styles.container}>
      <View style={styles.logoBlock}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>성균공지</Text>
        <Text style={styles.subtitle}>통합 공지와 마감 알림을 한 화면에서</Text>
      </View>
      <ActivityIndicator color={colors.primary} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  logoBlock: {
    alignItems: 'center',
  },
  logoMark: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  title: {
    fontSize: 30,
    color: colors.text,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
});
