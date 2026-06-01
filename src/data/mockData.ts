export const homeSummary = {
  dailyMission: 'Easy 3 km reset run',
  currentStreak: 8,
  weekDistance: '18.4 km',
  recommendedCourse: {
    name: 'River Loop Reset',
    distance: '3.2 km',
    difficulty: 'Easy',
    elevation: '+24 m',
    duration: '22-28 min'
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
    name: 'River Loop Reset',
    area: 'Flat riverside path',
    distance: '3.2 km',
    difficulty: 'Easy',
    elevation: '+24 m',
    duration: '22-28 min',
    focus: 'Recovery'
  },
  {
    id: 'park-tempo',
    name: 'Park Tempo Circuit',
    area: 'Shaded city park loop',
    distance: '5.0 km',
    difficulty: 'Medium',
    elevation: '+62 m',
    duration: '32-40 min',
    focus: 'Tempo'
  },
  {
    id: 'hill-climb',
    name: 'Hill Climb Builder',
    area: 'Short climbs with wide sidewalks',
    distance: '4.4 km',
    difficulty: 'Hard',
    elevation: '+148 m',
    duration: '36-46 min',
    focus: 'Strength'
  },
  {
    id: 'sunset-bridge',
    name: 'Sunset Bridge Run',
    area: 'Open route with steady pacing',
    distance: '6.1 km',
    difficulty: 'Medium',
    elevation: '+41 m',
    duration: '40-50 min',
    focus: 'Endurance'
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
  nextMilestone: 'Complete two more easy runs to unlock the 10K Base plan',
  weeklyRuns: [
    { id: 'mon', day: 'Mon', label: 'Easy', distance: '4.0 km', completed: true },
    { id: 'wed', day: 'Wed', label: 'Tempo', distance: '5.2 km', completed: true },
    { id: 'fri', day: 'Fri', label: 'Easy', distance: '3.1 km', completed: true },
    { id: 'sat', day: 'Sat', label: 'Long', distance: '6.1 km', completed: true },
    { id: 'sun', day: 'Sun', label: 'Reset', distance: '3.0 km', completed: false }
  ]
};

export const profileStats = {
  name: 'You',
  plan: '5K Base Builder',
  streakDays: 8,
  totalDistance: '214.6 km',
  totalRuns: 57,
  bestRecords: [
    { label: 'Fastest 1 km', value: '4:38' },
    { label: 'Fastest 5 km', value: '25:12' },
    { label: 'Longest run', value: '12.4 km' },
    { label: 'Best weekly distance', value: '31.8 km' }
  ]
};
