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

[스레드 글쓰기 원칙]
1. 첫 두 줄에서 스크롤을 멈추게 만드는 훅 필수
2. 글 자체로 완결 (링크 의존 금지)
3. 마지막에 댓글 유도 질문 또는 여운
4. 이모지 최소화 (끝에 1개)
5. 단락은 1~3줄 단위로 짧게
6. 해시태그 없음
7. 200자 내외, 최대 350자

[금지]
- ~습니다, ~입니다 격식체
- 과도한 제품 홍보
- 이모지 나열`;

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
