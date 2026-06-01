import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '@/theme/colors';

type TabIconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: TabIconName, focusedName: TabIconName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons name={focused ? focusedName : name} size={24} color={color} />
  );
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
          title: 'Home',
          tabBarIcon: tabIcon('home-outline', 'home')
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: tabIcon('map-outline', 'map')
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: tabIcon('bar-chart-outline', 'bar-chart')
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person-outline', 'person')
        }}
      />
    </Tabs>
  );
}
