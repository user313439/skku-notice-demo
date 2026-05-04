import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { colors } from '@/src/theme/colors';

type IconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, IconName> = {
  home: 'home',
  search: 'search',
  notifications: 'notifications',
  profile: 'person',
};

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => {
        const baseIcon = tabIcons[route.name] ?? 'ellipse';
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#4B5563',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 4,
            marginBottom: 1,
          },
          tabBarItemStyle: {
            justifyContent: 'flex-end',
            paddingTop: 8,
            paddingBottom: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? baseIcon : `${baseIcon}-outline`) as IconName}
              size={22}
              color={color}
            />
          ),
          tabBarStyle: {
            height: 68,
            paddingTop: 6,
            paddingBottom: 10,
            backgroundColor: colors.white,
            borderTopColor: colors.border,
            borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
            borderRightWidth: Platform.OS === 'web' ? 1 : 0,
            borderColor: colors.border,
            maxWidth: 430,
            width: '100%',
            alignSelf: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        };
      }}>
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen name="search" options={{ title: '검색' }} />
      <Tabs.Screen name="bookmarks" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ title: '알림' }} />
      <Tabs.Screen name="profile" options={{ title: '프로필' }} />
    </Tabs>
  );
}
