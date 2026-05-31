# RunGrowth PRD v1.0

## 1. Product Mission
RunGrowth helps runners clearly see their progress and want to run again.

Core principle:
- The app should make users feel: “I am improving.”
- Social features are not the starting point.
- Competition and shared running experiences are added only after enough users exist.

## 2. Target Users
Primary target:
- Young beginner to intermediate runners
- People who want to run consistently but struggle with motivation
- People who do not know where to run
- People who want to feel their running improvement clearly

Secondary target:
- Runners who dislike heavy running crews or social pressure
- Runners who want light competition without DM, chat, or forced meetups

## 3. Core User Problems
1. I do not know where to run.
2. I cannot clearly feel whether I am improving.
3. Running alone makes motivation weak.
4. Running crews feel socially burdensome.

## 4. MVP Scope
The first version must work even with only one user.

Included in MVP:
- Home screen
- Today’s recommended run
- Start Run screen placeholder
- Progress Report screen
- Courses screen
- Profile screen
- Mock data only
- Clean, modern mobile UI

Excluded from MVP:
- DM
- Chat
- Comments
- Social feed
- Friend search
- Meetup matching
- Real-time running together
- League system
- Backend
- GPS tracking
- Payment

## 5. MVP Core Flow
1. User opens the app.
2. User sees today’s recommended run.
3. User sees recent progress summary.
4. User taps Start Run.
5. User sees a placeholder running screen.
6. User checks Progress Report.

## 6. Screens

### 6.1 Home
Purpose:
- Make the user want to run today.

Content:
- Today’s recommended run
- Estimated distance
- Estimated time
- Recent improvement summary
- Current streak
- Start Run button

Example:
- Today’s Run: Easy 5K
- Estimated Time: 31 min
- Recent 5K improvement: 34:21 → 31:48
- Streak: 4 days

### 6.2 Start Run
Purpose:
- Placeholder for future GPS tracking.

Content:
- Distance placeholder
- Time placeholder
- Pace placeholder
- Start / Pause / Finish buttons, mock only

### 6.3 Progress Report
Purpose:
- Show growth clearly.

Content:
- 5K record improvement
- Weekly distance
- Running frequency
- Personal bests
- Simple charts or cards

Core emotional goal:
- The user should feel: “I am getting better.”

### 6.4 Courses
Purpose:
- Help users decide where to run.

Content:
- Recommended courses
- Distance
- Difficulty
- Elevation
- Estimated time

Initial data:
- Mock courses only

### 6.5 Profile
Purpose:
- Show accumulated progress.

Content:
- Total distance
- Total runs
- Current streak
- Best 3K / 5K records

## 7. Design Direction
Style:
- Clean
- Modern
- Premium
- Youthful
- Motivational but not childish

Avoid:
- Overly complex dashboard
- Heavy SNS feeling
- Chat-like UI
- Dating app impression

## 8. Future Roadmap

### Phase 1: Growth MVP
- Recommended runs
- Progress report
- Basic course list
- Mock UI

### Phase 2: Real Running Data
- GPS tracking
- Run history
- Real progress calculation
- Local storage or Supabase

### Phase 3: Regional League
Only after enough users exist.

Features:
- Daily/weekly league
- Similar-level ranking
- Consistency ranking

### Phase 4: Mutual Subscription Competition
Features:
- Mutual subscription
- Same challenge participation
- No DM
- No chat
- No personal contact exchange

### Phase 5: Optional Same-Time Running
Features:
- Users can join the same scheduled running event
- The app only shows time, course, and participation
- No direct communication
- No contact sharing

## 9. Product Rules
Hard rules:
- Do not add DM.
- Do not add chat.
- Do not add comments in MVP.
- Do not make this a dating app.
- Do not make this a heavy social network.
- The app should work even when there are no other users.

## 10. First Development Goal
Create a runnable Expo React Native TypeScript prototype using mock data.

Required stack:
- Expo
- React Native
- TypeScript
- Expo Router or React Navigation

Run commands:
```bash
npm install
npx expo start
```
