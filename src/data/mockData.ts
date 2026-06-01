export const homeSummary = {
  dailyMission: '3km 가볍게 리셋 러닝',
  currentStreak: 8,
  weekDistance: '18.4 km',
  growth: {
    period: '최근 30일 성장',
    recordLabel: '5km 기록',
    beforeRecord: '34:12',
    afterRecord: '31:48',
    improvement: '7.0% 향상',
    growthIndex: 72,
    message: '어제보다 러너에 가까워졌어요'
  },
  runnerTier: {
    tier: 'Silver Runner II',
    hiPoint: 78,
    hiPointGoal: 100,
    nextTierGap: 22
  },
  recommendedCourse: {
    name: '리버사이드 리셋 코스',
    distance: '3.2 km',
    difficulty: '쉬움',
    elevation: '+24 m',
    duration: '22-28분'
  },
  weeklyGoal: {
    current: 18.4,
    goal: 25,
    label: '18.4 / 25 km'
  }
};

export const recommendedCourses = [
  {
    id: 'river-loop',
    name: '리버사이드 리셋 코스',
    area: '강변을 따라 달리는 평탄한 길',
    distance: '3.2 km',
    difficulty: '쉬움',
    elevation: '+24 m',
    duration: '22-28분',
    focus: '회복'
  },
  {
    id: 'park-tempo',
    name: '공원 템포 루프',
    area: '그늘이 있는 도심 공원 순환 코스',
    distance: '5.0 km',
    difficulty: '보통',
    elevation: '+62 m',
    duration: '32-40분',
    focus: '템포'
  },
  {
    id: 'hill-climb',
    name: '언덕 빌드업 코스',
    area: '짧은 오르막과 넓은 보도가 이어지는 길',
    distance: '4.4 km',
    difficulty: '어려움',
    elevation: '+148 m',
    duration: '36-46분',
    focus: '근력'
  },
  {
    id: 'sunset-bridge',
    name: '선셋 브리지 러닝',
    area: '페이스를 안정적으로 잡기 좋은 탁 트인 코스',
    distance: '6.1 km',
    difficulty: '보통',
    elevation: '+41 m',
    duration: '40-50분',
    focus: '지구력'
  }
];

export const progressSummary = {
  weeklyGoal: {
    current: 18.4,
    goal: 25,
    label: '18.4 / 25 km'
  },
  easyPaceMinutes: 74,
  activeDays: 4,
  consistency: 0.8,
  nextMilestone: '가벼운 러닝 2회를 더 채우면 10K 베이스 플랜이 열려요',
  weeklyRuns: [
    { id: 'mon', day: '월', label: '가볍게', distance: '4.0 km', completed: true },
    { id: 'wed', day: '수', label: '템포', distance: '5.2 km', completed: true },
    { id: 'fri', day: '금', label: '가볍게', distance: '3.1 km', completed: true },
    { id: 'sat', day: '토', label: '롱런', distance: '6.1 km', completed: true },
    { id: 'sun', day: '일', label: '리셋', distance: '3.0 km', completed: false }
  ]
};

export const profileStats = {
  name: '나의 기록',
  plan: '5K 베이스 빌더',
  streakDays: 8,
  totalDistance: '214.6 km',
  totalRuns: 57,
  bestRecords: [
    { label: '가장 빠른 1km', value: '4:38' },
    { label: '가장 빠른 5km', value: '25:12' },
    { label: '최장 거리', value: '12.4 km' },
    { label: '최고 주간 거리', value: '31.8 km' }
  ]
};
