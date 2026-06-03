# Runner's Hi

Runner's Hi is a TypeScript Expo React Native MVP for GPS-based running growth.

It uses Expo Router, bottom tabs, foreground GPS tracking, AsyncStorage run records, PB, Hi Point, tiers, weekly goals, and streaks. There is no login, direct messaging, chat, comments, social feed, or meetup functionality.

## Screens

- Home: growth summary, tier, weekly goal, streak, and start action
- Progress: run totals, personal bests, weekly goal progress, streak, and recent runs
- Courses: recommended training routes with distance, elevation, duration, and focus
- Profile: current tier, Hi Point, running totals, streak, and best records

## Project Structure

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    progress.tsx
    courses.tsx
    profile.tsx
src/
  components/
  features/runs/
  lib/supabase.ts
  theme/
```

## Requirements

- Node.js LTS
- Expo Go on iOS or Android, or a local simulator

## Run Locally

From this repository:

```sh
npm install
npm run start
```

Scan the QR code with Expo Go, or press `i` for iOS Simulator / `a` for Android Emulator in the Expo terminal.

## Useful Commands

```sh
npm run ios
npm run android
npm run web
npx tsc --noEmit
```

## Supabase 준비

현재 앱은 AsyncStorage로 러닝 기록을 저장합니다. Supabase 연동은 아직 활성화하지 않았고, 환경변수와 클라이언트 레이어만 준비되어 있습니다.

1. Supabase 프로젝트를 생성합니다.
2. `.env.example`을 참고해 로컬 `.env`를 만듭니다.
3. 아래 값을 Supabase 프로젝트 설정에서 복사해 입력합니다.

```sh
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

실제 키는 커밋하지 마세요. 테이블 초안은 `docs/supabase-schema.md`를 참고하세요.
