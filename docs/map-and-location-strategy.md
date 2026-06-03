# Runner's Hi 지도/GPS 전략

## 현재 구조

Runner's Hi의 러닝 기록은 지도 API가 아니라 GPS 좌표를 기준으로 저장합니다. 앱은 `expo-location`으로 포그라운드 위치를 측정하고, 수집된 좌표 목록을 거리 계산과 경로 저장에 사용합니다.

- GPS 위치 측정: `expo-location`
- 지도 렌더링: `react-native-maps`
- 러닝 거리 계산: 저장된 GPS 좌표 기반
- 러닝 경로 저장: GPS 좌표 리스트 기반
- 지도 API 역할: 현재 위치와 저장 경로를 화면에 표시

## iOS 지도

iOS의 `react-native-maps` 기본 지도는 Apple MapKit 기반으로 표시합니다. 현재 Runner's Hi 1.0 MVP 범위에서는 iOS 지도 표시를 위해 별도 지도 API Key가 필요하지 않습니다.

iOS 위치 권한은 `app.json`의 `NSLocationWhenInUseUsageDescription`과 `expo-location` 플러그인 문구로 설정합니다.

현재 권한 문구:

```text
러닝 거리와 경로를 자동으로 기록하기 위해 위치 권한이 필요합니다.
```

백그라운드 위치 권한은 현재 추가하지 않습니다. Runner's Hi 1.0은 포그라운드 러닝 기록만 지원합니다.

## Android 지도

Android의 `react-native-maps` 지도는 Google Maps 기반으로 표시합니다. Android 독립 빌드에서 Google Maps API Key가 필요한 경우를 대비해 `app.config.js`에서 환경변수 기반 주입 구조를 준비했습니다.

환경변수 이름:

```text
GOOGLE_MAPS_API_KEY
```

EAS Build에서는 실제 값을 코드에 넣지 않고 EAS secrets로 등록합니다.

```sh
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "실제 Google Maps API Key"
```

`GOOGLE_MAPS_API_KEY` 값이 없으면 `android.config.googleMaps.apiKey`는 생성되지 않습니다. 실제 API Key는 저장소에 커밋하지 않습니다.

Android 위치 권한은 `app.json`에 아래 foreground 권한만 선언합니다.

```text
ACCESS_FINE_LOCATION
ACCESS_COARSE_LOCATION
```

백그라운드 위치 권한은 현재 추가하지 않습니다.

## 네이버 지도 SDK 검토 기준

현재 단계에서는 네이버 지도 SDK로 교체하지 않습니다. Runner's Hi 1.0 MVP의 핵심은 GPS 기반 러닝 기록, 성장 시스템, 코스 저장과 재실행이며, 현재 구조로 iOS/Android 지도 표시와 좌표 기반 기록을 유지할 수 있습니다.

네이버 지도 SDK는 아래 기능을 구현하는 단계에서 다시 검토합니다.

- 위치 기반 추천
- 보행자 경로 생성
- 한국 장소 검색
- 코스 자동 생성

## 출시 전 점검 기준

- 위치 측정은 `expo-location` foreground 권한만 사용합니다.
- 거리/경로 저장은 지도 API가 아닌 GPS 좌표 기반으로 유지합니다.
- iOS는 MapKit 기반으로 별도 지도 API Key 없이 동작합니다.
- Android Google Maps API Key는 환경변수 또는 EAS secrets로만 주입합니다.
- 실제 API Key는 코드, 문서, `.env.example`에 커밋하지 않습니다.
