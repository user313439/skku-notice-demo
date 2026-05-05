# SKKU Notice Demo

성균 공지 통합 알림 서비스 SRS 제출과 발표 시연에 사용할 Expo + React Native 데모 앱입니다. 아직 실제 백엔드, 크롤러, BERT 모델, 푸시 서버를 붙인 상태는 아니고, 공식 페이지에서 확인한 학과 구조와 소프트웨어학과 최신 공지 목록을 바탕으로 목 데이터와 로컬 저장 흐름을 구현했습니다.

## 기술 스택

- Expo SDK 54
- React Native + TypeScript
- Expo Router
- AsyncStorage 기반 로컬 저장
- 목 API / 목 크롤러 상태 / 목 KoBERT 분류기 서비스 계층
- 공식 SKKU 학과 구조 기반 단과대-학과 선택 UI

## 실행 방법

처음 받는 경우에는 아래 순서대로 실행하면 됩니다.

```powershell
git clone https://github.com/user313439/skku-notice-demo.git
cd skku-notice-demo
npm install
npm run web
```

웹 브라우저가 자동으로 열리지 않으면 Chrome 또는 Edge 주소창에 `http://localhost:8081`를 입력해서 들어가면 됩니다.

Android Emulator에서 확인하려면 Android Studio에서 에뮬레이터를 켠 뒤 아래 명령을 실행합니다.

```powershell
npm run android
```

타입 검사:

```powershell
npm run typecheck
```

## 데모 주요 기능

- 온보딩에서 단과대학을 먼저 선택하고 해당 학과, 전공, 단과대 전체 구독 선택
- 홈 피드에서 전체 구독, 단과대 전체, 개별 학과/전공 단위로 공지 범위 전환
- 읽지 않은 공지 배너 클릭 시 전용 목록 화면으로 이동
- 홈 배너의 알림 ON/OFF 버튼으로 알림 수신 상태 즉시 변경
- 가로 필터는 스크롤바를 숨기고 좌우 화살표 버튼으로 웹에서도 이동 가능
- 전체, 학사, 장학, 취업, 행사/세미나, 모집, 일반 카테고리 필터
- D-7, D-3, D-Day, 마감, 상시, 일정 없음 상태 표시
- 공지 상세 진입 시 읽음 상태 저장
- 홈 화면의 최신순, 마감임박순 정렬과 별도 저장함 / 지난 일정 진입 카드
- 즐겨찾기 저장 및 D-Day 화면에서 리마인더 옵션 변경
- 제목, 본문, 태그 검색과 학과, 카테고리, 읽음, 북마크, 마감 상태 필터
- 키워드 규칙 기반 목 알림 생성
- 알림 센터에서 새 공지, 키워드 매칭, 마감 임박, 시스템 알림 확인
- 알림은 공지 상세를 실제로 확인하면 목록에서 처리
- 프로필 편집, 구독 학과, 키워드, 알림 토글 변경
- System Status 화면에서 목 크롤러와 KoBERT Notice Classifier Mock 상태 표시

## 데이터 출처와 데모 반영 방식

- 성균관대학교 공식 교육/대학 페이지를 기준으로 단과대학과 학과 선택지를 확장했습니다.
- 성균관대학교 소프트웨어학과 공지사항 페이지에서 2026년 4월 30일 기준 확인한 최신 공지 제목을 주요 목 데이터에 반영했습니다.
- 실제 원문 수집은 아직 구현하지 않았기 때문에 앱 내부에서는 공식 공지 기반 목 데이터와 목 크롤링 시간을 함께 보여줍니다.

## 구현 구조

```text
app/
  index.tsx
  onboarding.tsx
  (tabs)/
    home.tsx
    search.tsx
    bookmarks.tsx
    notifications.tsx
    profile.tsx
  notice/[id].tsx
  unread.tsx
  settings.tsx
  system-status.tsx

src/
  components/
  data/
  services/
  state/
  theme/
  utils/
```

SRS에서 요구한 교체 가능한 서비스 계층은 아래 파일로 분리했습니다.

- `src/services/mockNoticeApi.ts`
- `src/services/mockUserStore.ts`
- `src/services/mockNotificationService.ts`
- `src/services/mockClassifier.ts`
- `src/services/mockCrawlerStatus.ts`

## 현재 목 구현 한계

- 실제 학교 공지 사이트 크롤링은 수행하지 않습니다.
- 실제 BERT 추론 대신 공지별 분류 신뢰도 값을 목 데이터로 제공합니다.
- 실제 FCM/APNs 푸시 전송 대신 앱 내부 알림 센터에 목 알림을 생성합니다.
- 학교 로그인, 개인정보, 서버 DB 연동은 포함하지 않았습니다.

## 향후 연동 계획

1. `mockNoticeApi.ts`를 실제 Feed API 호출로 교체합니다.
2. `mockUserStore.ts`의 로컬 저장 상태를 서버 사용자 설정 API와 동기화합니다.
3. `mockNotificationService.ts`를 FCM/APNs 토큰 등록 및 알림 이력 API로 확장합니다.
4. `mockClassifier.ts`의 목 설명을 BERT Worker 응답값으로 교체합니다.
5. `mockCrawlerStatus.ts`를 관리자 대시보드 또는 운영 API 응답으로 교체합니다.

## SRS 캡처 안내

SRS에 넣을 Figure별 캡처 방법은 `docs/SRS_APP_DEMO_GUIDE.md`에 정리했습니다.

## 검증 상태

- `npm run typecheck` 통과
- `npx expo export --platform web --output-dir dist-verify-20260505 --dev --no-minify --max-workers 1` 성공
- Expo export 중 `props.pointerEvents is deprecated` 경고가 1건 표시되지만, React Native Web 내부 경고이며 데모 실행을 막는 오류는 아닙니다.
