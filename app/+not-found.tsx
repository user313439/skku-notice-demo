import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { EmptyState } from '@/src/components/EmptyState';
import { colors } from '@/src/theme/colors';

export default function NotFoundScreen() {
  return (
    <AppShell scroll={false} contentStyle={styles.container}>
      <EmptyState title="화면을 찾을 수 없습니다" body="요청한 데모 화면이 존재하지 않습니다." />
      <Pressable onPress={() => router.replace('/home')} style={styles.button}>
        <Text style={styles.buttonText}>홈으로 이동</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
});
