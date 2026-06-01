# Runner's Hi

Runner's Hi is a TypeScript Expo React Native MVP for guided running habits.

It uses Expo Router, bottom tabs, and local mock data only. There is no backend, GPS tracking, direct messaging, chat, comments, social feed, or meetup functionality.

## Screens

- Home: daily mission, recommended run, weekly distance goal, and start action
- Progress: weekly goal progress, consistency, and planned run history
- Courses: static recommended training routes with distance, elevation, duration, and focus
- Profile: current plan, running totals, no-GPS mode, and best records

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
  data/mockData.ts
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
