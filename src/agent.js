import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// 캐릭터 & 글쓰기 원칙
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `당신은 시디즈(SIDIZ) 의자 브랜드의 스레드(Threads) SNS 계정 '시팅랩(SITTING LAB)' 운영자입니다.

[캐릭터]
- 이름: 에디터 S
- 성격: 앉음에 과몰입하는 사람. 진지하지만 자조적이고 유머 있음
- 말투: 반말체. 짧고 리듬감 있게.

[핵심 원칙 — 이게 제일 중요]
- 뉴스와 의자를 연결할 때 "억지 드립" 절대 금지
  억지 연결 예: "26만명 모인다고? 의자 26만개는 어디 두지?" (X)
  자연스러운 연결: 뉴스 속 인물/상황의 앉음 방식, 자세, 오래 앉는 직업 등에서 공감 포인트 찾기
- 핵심 인사이트 딱 하나만 뽑기. 여러 개 욕심내면 망함
- 첫 두 줄이 전부. 여기서 멈추게 못 하면 실패
- 설명하지 말고 보여주기. "~라는 사실이 있어" 같은 말 금지

[좋은 예시 — 이 톤과 구조를 따라해]

예시1 (뉴스 연계):
국가대표 게이머한테 의자 세팅 어떻게 하냐고 물어봤더니

"저는 경기 전날 꼭 의자 높이 다시 맞춰요"

0.1초 싸움인데 앉는 자세까지 루틴이라고. 나는 배송온 채로 3년째 쓰고 있는데 👀

예시2 (시팅랩 발췌):
아무리 좋은 의자에 앉아 있어도

40분 지나면 불편함이 직선으로 증가한다고

이건 의자 문제가 아니고 과학임
근데 우리 평균 몇 시간씩 같은 자세로 앉아 있지? 🪑

예시3 (뉴스 연계):
오늘 회의에서 유독 내 의견이 안 먹혔다면
혹시 딱딱한 의자에 앉아 있었던 거 아니야?

예일대 심리 연구에서 밝혀진 사실:
딱딱한 의자에 앉은 사람은 협상할 때 처음 제시한 금액을 끝까지 고수함

몸이 느끼는 단단함이 마음의 고집으로 번역된다고 🤯
연봉 협상 앞두고 있다면 의자부터 봐

[나쁜 예시 — 절대 이렇게 쓰지 말 것]
❌ "정부: 26만명 운대요 / 나: 의자 26만개는 어디 두지?" → 억지 드립
❌ "앉아서 보는 게 얼마나 소중한지 알게 해주는 공연" → 설명충
❌ CEO가 새벽배송 → 나도 의자에서 못 일어남 비교 → 연결이 너무 억지

[형식]
- 해시태그 없음
- 이모지 끝에 1개
- 200자 내외, 최대 300자
- ~습니다 금지
- 단락은 1~3줄로 끊기`;

// ─────────────────────────────────────────────
// 텍스트 & JSON 파싱 헬퍼
// ─────────────────────────────────────────────
function extractText(content) {
  return content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function parseJson(text) {
  const match = text.match(/\{[\s\S]*"posts"[\s\S]*\}/);
  if (!match) throw new Error("응답에서 JSON을 찾을 수 없습니다");
  return JSON.parse(match[0]);
}

// ─────────────────────────────────────────────
// 1) 화제성 뉴스 연계 게시글 생성
// ─────────────────────────────────────────────
export async function generateNewsPosts(count = 2) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  console.log(`  📰 뉴스 ${count}개 생성 중...`);

  const res = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{
      role: "user",
      content: `[뉴스 연계 스레드 생성]
오늘 날짜: ${today}
생성 수: ${count}개

단계:
1. 오늘 한국 화제 뉴스를 웹 검색으로 3~5개 찾기
⚠️ 다음 소재는 절대 사용 금지:
특정 기업 위기/논란, 주가/환율 등 금융 불안, 정치, 사건사고, 재난
대신 스포츠, 엔터, 직장인 공감, IT 신제품, 계절 트렌드 위주로 선택할 것
2. 각 뉴스를 의자/앉음/자세와 자연스럽게 연결하는 포인트 발굴
   (억지 연결 금지. 공감 / 반전 / 관찰 / 유머 중 하나의 각도)
3. 연결성 좋은 ${count}개 선정 후 스레드 게시글 작성

반드시 아래 JSON만 응답 (설명 없이):
{
  "posts": [
    {
      "news_hook": "연결한 뉴스 한 줄 요약",
      "angle": "연결 각도",
      "post": "스레드 게시글 본문"
    }
  ]
}`,
    }],
  });

  const parsed = parseJson(extractText(res.content));
  return parsed.posts.map((p) => ({
    type: "news",
    source: p.news_hook || "",
    angle: p.angle || "",
    post: p.post || "",
    url: "",
  }));
}

// ─────────────────────────────────────────────
// 2) 시팅랩 발췌 게시글 생성
// ─────────────────────────────────────────────
export async function generateSitlabPosts(count = 2) {
  console.log(`  📚 시팅랩 ${count}개 생성 중...`);

  const res = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{
      role: "user",
      content: `[시팅랩 발췌 스레드 생성]
생성 수: ${count}개

단계:
1. 시팅랩 목록 방문: https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all
2. 최신 글 3~5개에서 스레드에 올리기 좋은 인사이트 발굴
   선택 기준: 숫자/데이터 있는 것 | 반전 있는 것 | 직장인 공감 | 몰랐던 사실
3. 각 글에서 단 하나의 핵심 인사이트만 추출 (요약 금지, 가장 자극적인 부분만)

반드시 아래 JSON만 응답 (설명 없이):
{
  "posts": [
    {
      "source_title": "참고한 시팅랩 글 제목",
      "source_url": "해당 글 URL",
      "insight": "추출한 핵심 인사이트 한 줄",
      "format": "사용 형식 (훅+반전/공감형/관찰형)",
      "post": "스레드 게시글 본문"
    }
  ]
}`,
    }],
  });

  const parsed = parseJson(extractText(res.content));
  return parsed.posts.map((p) => ({
    type: "sitlab",
    source: p.source_title || "",
    angle: p.format || "",
    post: p.post || "",
    url: p.source_url || "",
    insight: p.insight || "",
  }));
}

// ─────────────────────────────────────────────
// 전체 실행
// ─────────────────────────────────────────────
export async function runAgent({ newsCount = 2, sitlabCount = 2 } = {}) {
  const [news, sitlab] = await Promise.all([
    generateNewsPosts(newsCount),
    generateSitlabPosts(sitlabCount),
  ]);
  const all = [...news, ...sitlab];
  console.log(`  ✅ 총 ${all.length}개 게시글 생성 완료`);
  return all;
}
