# bolt_multi_stopwatch

## 프로젝트 개요

**bolt_multi_stopwatch**는 여러 개의 스톱워치(레인)를 동시에 관리할 수 있는 React 기반 웹 애플리케이션입니다. 각 레인은 독립적으로 동작하며, 전체 레인에 대해 일괄적으로 시작, 정지, 리셋, 랩 기록, 기록 삭제 등의 기능을 제공합니다.

## 주요 기능
- 여러 개의 스톱워치(레인) 추가 및 삭제
- 각 레인별로 시간 측정, 랩 기록, 리셋, 기록 삭제
- 모든 레인에 대해 일괄적으로 시작(Start All), 정지(Stop All), 리셋(Reset All), 랩 기록(Lap All), 기록 삭제(Remove Records)
- 기록 삭제 시 확인 창 제공

## 폴더 및 파일 구조
```
index.html
package.json
README.md
src/
  App.css
  App.jsx         # 메인 컴포넌트, 전체 레인 관리 및 일괄 제어 기능 구현
  index.css
  main.jsx        # React 엔트리 포인트
  Stopwatch.css
  Stopwatch.jsx   # 개별 스톱워치(레인) 컴포넌트
```

## 실행 방법
1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 `http://localhost:5173` (또는 안내된 포트)로 접속

## 사용 기술
- React
- JavaScript (ES6+)
- CSS
- Vite (개발 서버)

---
문의 및 피드백은 이슈로 남겨주세요.
