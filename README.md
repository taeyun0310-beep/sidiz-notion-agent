# 🪑 시팅랩 스레드 에이전트

매일 오전 9시, 스레드 게시글 초안을 자동으로 생성해 Notion에 저장합니다.
서버 없이 GitHub Actions만으로 동작합니다.

---

## 흐름

```
매일 오전 9시 (GitHub Actions 자동 실행)
   ↓
① 뉴스 에이전트   오늘 화제 뉴스 검색 → 의자와 연결 → 게시글 생성
② 시팅랩 에이전트 시팅랩 사이트 탐색 → 핵심 인사이트 추출 → 게시글 생성
   ↓
③ Notion DB에 "초안" 상태로 저장
   → 담당자가 검토 후 "발행 완료"로 상태 변경
```

---

## 셋업 (3단계)

### Step 1 — Notion 준비

**1-1. Integration 만들기**
1. https://www.notion.so/my-integrations 접속
2. `+ 새 Integration` 클릭
3. 이름 입력 (예: 시팅랩 에이전트) → 제출
4. `Internal Integration Token` 복사해두기 → `NOTION_TOKEN`

**1-2. 데이터베이스 만들기**
1. Notion에서 새 페이지 생성 → `/database` 입력 → 전체 페이지 데이터베이스 선택
2. 아래 컬럼 추가:

| 컬럼명 | 타입 |
|------|------|
| 제목 | Title (기본 제공) |
| 유형 | Select |
| 게시글 | Text |
| 출처 | Text |
| 인사이트 | Text |
| 링크 | URL |
| 상태 | Select |
| 생성일 | Date |

3. 상태 컬럼 옵션 추가: `초안` / `검토` / `발행 완료`
4. 페이지 우상단 `...` → `Connections` → 내 Integration 연결
5. DB 페이지 URL에서 ID 복사:
   `notion.so/워크스페이스/`**`여기32자리`**`?v=...` → `NOTION_DATABASE_ID`

---

### Step 2 — GitHub 저장소 만들기

```bash
# 이 폴더를 GitHub에 올리기
git init
git add .
git commit -m "init"

# GitHub에서 새 저장소 만든 후
git remote add origin https://github.com/내계정/sidiz-notion-agent.git
git push -u origin main
```

---

### Step 3 — Secrets 등록

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret 이름 | 어디서 가져오나 |
|------------|--------------|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `NOTION_TOKEN` | Step 1-1에서 복사한 토큰 |
| `NOTION_DATABASE_ID` | Step 1-2에서 복사한 DB ID |

---

## 테스트 실행

GitHub 저장소 → **Actions** 탭 → **시팅랩 스레드 에이전트** → **Run workflow**

- `DRY RUN` 체크: Notion 저장 없이 콘솔 출력만 확인
- `DRY RUN` 미체크: 실제로 Notion에 저장

---

## 스케줄 변경

`.github/workflows/daily.yml` 파일에서:

```yaml
# 평일 오전 9시 KST (현재 설정)
- cron: "0 0 * * 1-5"

# 매일 오전 9시 KST
- cron: "0 0 * * *"

# 오전 9시 + 오후 2시 (하루 2회, 평일)
- cron: "0 0,5 * * 1-5"
```

> GitHub Actions cron은 UTC 기준 → KST 9시 = UTC 0시

---

## 비용

| 항목 | 비용 |
|------|------|
| GitHub Actions (공개 저장소) | 무료 |
| GitHub Actions (비공개 저장소) | 월 2,000분 무료 (1회 약 1~2분) |
| Claude API (1회 실행) | 약 $0.01~0.03 |
| Notion API | 무료 |
