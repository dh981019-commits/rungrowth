import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { hiTheme } from '@/theme/theme';

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
        tabBarActiveTintColor: hiTheme.colors.green,
        tabBarInactiveTintColor: hiTheme.colors.muted,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopWidth: 1,
          borderTopColor: hiTheme.colors.border,
          backgroundColor: hiTheme.colors.surface
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900'
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
        name="run-tab"
        options={{
          title: '달리기',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={30}
              color={color}
            />
          )
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
