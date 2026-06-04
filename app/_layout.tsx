import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RunTrackerProvider } from '@/features/runs/presentation/useRunTracker';

export default function RootLayout() {
  return (
    <RunTrackerProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </RunTrackerProvider>
  );
}
