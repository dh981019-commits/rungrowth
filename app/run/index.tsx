import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { type Href, router } from 'expo-router';

import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { RunCoordinate } from '@/features/runs/domain/runTypes';
import { useRunTracker } from '@/features/runs/presentation/useRunTracker';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

const fallbackRegion = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
};

function getMapRegion(routeCoordinates: RunCoordinate[]) {
  const currentCoordinate = routeCoordinates.at(-1);

  if (!currentCoordinate) {
    return fallbackRegion;
  }

  return {
    latitude: currentCoordinate.latitude,
    longitude: currentCoordinate.longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006
  };
}

export default function RunTrackingScreen() {
  const [note, setNote] = useState('');
  const {
    permissionDenied,
    status,
    elapsedSeconds,
    distanceMeters,
    averagePaceSecondsPerKm,
    routeCoordinates,
    errorMessage,
    gpsSignalMessage,
    startRun,
    pauseRun,
    resumeRun,
    finishRun,
    setErrorMessage
  } = useRunTracker();

  const mapRegion = useMemo(() => getMapRegion(routeCoordinates), [routeCoordinates]);

  useEffect(() => {
    startRun().catch(() => {
      setErrorMessage('GPS를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
    });
  }, [setErrorMessage, startRun]);

  const handleFinish = async () => {
    const savedRun = await finishRun(note);

    if (savedRun) {
      router.replace(`/run/${savedRun.id}` as Href);
    }
  };

  if (permissionDenied) {
    return (
      <View style={styles.permissionScreen}>
        <View style={commonStyles.iconBadge}>
          <Ionicons name="location-outline" size={26} color={colors.primary} />
        </View>
        <Text style={commonStyles.cardTitle}>GPS 권한이 필요해요</Text>
        <Text style={[commonStyles.bodyText, styles.centerText]}>
          러닝 거리와 경로를 자동으로 기록하려면 위치 권한을 허용해 주세요.
        </Text>
        <Pressable style={commonStyles.primaryButton} onPress={startRun}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={commonStyles.primaryButtonText}>권한 다시 요청</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.eyebrow}>GPS 러닝 기록</Text>
        <Text style={commonStyles.screenTitle}>러닝 중</Text>
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} region={mapRegion} showsUserLocation>
          {routeCoordinates.length > 0 ? (
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="현재 위치" />
          ) : null}
          {routeCoordinates.length > 1 ? (
            <Polyline coordinates={routeCoordinates} strokeColor={colors.primary} strokeWidth={5} />
          ) : null}
        </MapView>
        {routeCoordinates.length === 0 ? (
          <View style={styles.mapHint}>
            <ActivityIndicator color={colors.primary} />
            <Text style={commonStyles.supportingText}>GPS 신호를 찾는 중이에요</Text>
          </View>
        ) : null}
      </View>

      {gpsSignalMessage ? (
        <View style={styles.gpsNotice}>
          <Ionicons name="warning-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.gpsNoticeText}>{gpsSignalMessage}</Text>
        </View>
      ) : null}

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={commonStyles.cardLabel}>현재 거리</Text>
          <Text style={styles.metricValue}>{formatDistance(distanceMeters)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={commonStyles.cardLabel}>경과 시간</Text>
          <Text style={styles.metricValue}>{formatElapsedTime(elapsedSeconds)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={commonStyles.cardLabel}>평균 페이스</Text>
          <Text style={styles.metricValue}>{formatPace(averagePaceSecondsPerKm)}</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardLabel}>메모 선택</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="오늘 러닝 느낌을 남겨도 좋아요"
          placeholderTextColor={colors.muted}
          multiline
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonRow}>
        {status === 'paused' ? (
          <Pressable style={styles.secondaryButton} onPress={resumeRun}>
            <Ionicons name="play" size={20} color={colors.primaryDark} />
            <Text style={styles.secondaryButtonText}>재개</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={pauseRun}>
            <Ionicons name="pause" size={20} color={colors.primaryDark} />
            <Text style={styles.secondaryButtonText}>일시정지</Text>
          </Pressable>
        )}
        <Pressable
          style={[commonStyles.primaryButton, styles.finishButton]}
          onPress={handleFinish}
          disabled={status === 'saving'}
        >
          <Ionicons name="stop" size={20} color="white" />
          <Text style={commonStyles.primaryButtonText}>{status === 'saving' ? '저장 중' : '종료'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permissionScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.background
  },
  centerText: {
    textAlign: 'center'
  },
  mapWrap: {
    height: 320,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  map: {
    flex: 1
  },
  mapHint: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface
  },
  gpsNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt
  },
  gpsNoticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800'
  },
  metricGrid: {
    gap: 12
  },
  metricCard: {
    gap: 4,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  metricValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900'
  },
  noteInput: {
    minHeight: 82,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '800'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  secondaryButton: {
    minHeight: 58,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '900'
  },
  finishButton: {
    flex: 1
  }
});
