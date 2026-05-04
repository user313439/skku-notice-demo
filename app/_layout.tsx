import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AppStateProvider } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notice/[id]" />
          <Stack.Screen name="unread" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="system-status" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
