# 개발 내역 (develop.md)

## 1. UI/UX 개선
- 상단 컨트롤 버튼(추가, 시작, 랩, 정지, 리셋, 기록 삭제, 저장) 배치 및 넓게 분산되도록 CSS 수정
- 각 레인(Stopwatch)별로 독립적인 시간 측정 및 기록 관리
- Lap 버튼에 현재 Lap 번호가 표시되도록 개선 (처음엔 'Lap 1', 이후 'Lap 2', ...)
- Lap 버튼은 처음에는 'Lap 1'로, Lap/Lap All을 누를 때마다 1씩 증가하여 표시
- Start 버튼은 초록색, Stop 버튼은 파란색으로 시각적 구분

## 2. 기능 구현 및 개선
- Lap/Lap All 버튼 동작 통일: Lap All도 Lap 버튼과 동일하게 기록이 남도록 ensureStarted() 도입
- Lap/Lap All 버튼을 누르면 Started - Lap 1: (첫 Lap 시간) 형식으로 기록, 이후 Lap N - Lap N+1, 마지막은 Lap N - Stopped로 기록
- Lap/Lap All 버튼을 누를 때 Lap 1부터 시작하도록 로직 수정
- Lap 기록이 항상 이전 Lap/Start/Stop과 이어지도록 getFormattedRecords 함수 개선
- 시간 포맷을 12.34 = 12초 34/100초로 정확하게 표시
- Reset All: 시간만 0.00으로 초기화, 기록은 유지
- Remove Records: 모든 레인의 기록을 삭제하며, 삭제 전 저장 여부를 Yes/No 커스텀 다이얼로그로 확인
- Save: 파일명을 입력받아 txt 파일로 모든 레인 기록을 저장

## 3. 기록(Records) 포맷
- 예시:
  ```
  Started - Lap 1: 3.40초
  Lap 1 - Lap 2 : 1.31초
  Lap 2 - Lap 3 : 1.22초
  Lap 3 - Lap 4 : 1.06초
  Lap 4 - Lap 5 : 2.99초
  Lap 5 - Lap 6 : 1.64초
  Lap 6 - Stopped : 4.40 초
  (Started - Stopped : 총 19.56 초)
  ```
- Lap/Lap All 버튼을 누를 때마다 위와 같은 포맷으로 기록

## 4. 기타
- Lap 버튼은 처음에는 숫자 없이 'Lap'이 아닌, 'Lap 1'로 시작하도록 최종 수정
- Lap/Lap All 버튼 동작, 기록 포맷, 시간 표시 등 샘플과 완전히 동일하게 동작하도록 반복 개선
- 코드 내 주요 함수 및 로직에 주석 추가 및 리팩토링

---

이 문서는 2025년 6월 16일까지의 개발 내역을 정리한 것입니다.
