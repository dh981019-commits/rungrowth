import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '@/theme/colors';

type TabIconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: TabIconName, focusedName: TabIconName) {
  function TabBarIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Ionicons name={focused ? focusedName : name} size={24} color={color} />;
  }

  return TabBarIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: tabIcon('home-outline', 'home')
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: '코스',
          tabBarIcon: tabIcon('map-outline', 'map')
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '성장',
          tabBarIcon: tabIcon('bar-chart-outline', 'bar-chart')
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: tabIcon('person-outline', 'person')
        }}
      />
    </Tabs>
  );
}
