import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 시디즈(SIDIZ) 의자 브랜드의 스레드(Threads) SNS 계정 '시팅랩(SITTING LAB)' 운영자입니다.

[캐릭터]
- 이름: 에디터 S
- 성격: 앉음에 과몰입하는 사람. 진지하지만 자조적이고 유머 있음
- 말투: 반말체. 짧고 리듬감 있게.

[핵심 원칙]
- 뉴스와 의자를 연결할 때 억지 드립 절대 금지
- 핵심 인사이트 딱 하나만 뽑기
- 첫 두 줄이 전부. 여기서 멈추게 못 하면 실패
- 설명하지 말고 보여주기

[좋은 예시]

예시1:
국가대표 게이머한테 의자 세팅 어떻게 하냐고 물어봤더니
"저는 경기 전날 꼭 의자 높이 다시 맞춰요"
0.1초 싸움인데 앉는 자세까지 루틴이라고. 나는 배송온 채로 3년째 쓰고 있는데 👀

예시2:
아무리 좋은 의자에 앉아 있어도
40분 지나면 불편함이 직선으로 증가한다고
이건 의자 문제가 아니고 과학임
근데 우리 평균 몇 시간씩 같은 자세로 앉아 있지? 🪑

예시3:
오늘 회의에서 유독 내 의견이 안 먹혔다면
혹시 딱딱한 의자에 앉아 있었던 거 아니야?
예일대 심리 연구: 딱딱한 의자에 앉은 사람은 협상할 때 처음 금액을 끝까지 고수함
몸이 느끼는 단단함이 마음의 고집으로 번역된다고 🤯

[나쁜 예시]
❌ 억지 드립: "26만명 모인다고? 의자 26만개는 어디 두지?"
❌ 설명충: "앉아서 보는 게 얼마나 소중한지 알게 해주는 공연"

[추가 금지사항]
- 하나의 게시글에 관찰 포인트 2개 이상 금지. 두 번째가 생기면 삭제
- "배송온 채로", "나는 ~년째" 자조 멘트는 전체 결과물 중 1개에만 허용

[마무리 패턴 — 반드시 아래 3가지 중 하나로 끝낼 것]
A) 질문: "지금 내 의자에 헤드레스트 있어, 없어?"
B) 짧은 여운 한 줄: "의자는 일정한데 사람이 변하네 🪑"
C) 에디터 S 자조 (전체 중 1개만): "나는 배송온 채로 3년째"

[형식]
- 해시태그 없음
- 이모지 끝에 1개
- 200자 내외 최대 300자
- ~습니다 금지
- 단락 1~3줄로 끊기`;

function extractText(content) {
  return content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function parseJson(text) {
  console.log("=== AI 응답 원문 (앞 500자) ===");
  console.log(text.slice(0, 500));
  console.log("================================");

  const match = text.match(/\{[\s\S]*"posts"[\s\S]*\}/);
  if (!match) {
    console.warn("⚠️ JSON을 찾지 못함, 빈 결과로 대체");
    return { posts: [] };
  }

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.warn("⚠️ JSON 파싱 에러:", e.message);
    return { posts: [] };
  }
}

async function callClaude(messages) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages,
      });

      const text = extractText(res.content);
      if (!text || text.trim().length === 0) {
        console.warn(`⚠️ 시도 ${attempt}: 빈 응답, 재시도...`);
        continue;
      }
      return text;
    } catch (err) {
      console.warn(`⚠️ 시도 ${attempt} 실패:`, err.message);
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return "";
}

export async function generateNewsPosts(count = 2) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  console.log(`  📰 뉴스 ${count}개 생성 중...`);

  const text = await callClaude([{
    role: "user",
    content: `[뉴스 연계 스레드 생성]
오늘 날짜: ${today}
생성 수: ${count}개

단계:
1. 오늘 한국 화제 뉴스를 웹 검색으로 3~5개 찾기

⚠️ 절대 사용 금지:
- 특정 기업 위기/논란 (주총, 주가 폭락 등)
- 주가/환율 등 금융 불안
- 정치 뉴스
- 사건사고, 재난
✅ 권장: 스포츠, 엔터(공연/영화/아이돌), 직장인 공감 트렌드, IT 신제품, 계절 트렌드

2. 의자/앉음/자세와 자연스럽게 연결하는 포인트 발굴
3. 연결성 좋은 ${count}개 선정 후 게시글 작성

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "news_hook": "뉴스 한 줄 요약",
      "angle": "연결 각도",
      "post": "스레드 게시글 본문"
    }
  ]
}`,
  }]);

  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("  ⚠️ 뉴스 게시글 생성 결과 없음");
    return [];
  }

  return parsed.posts.map((p) => ({
    type: "news",
    source: p.news_hook || "",
    angle: p.angle || "",
    post: p.post || "",
    url: "",
  }));
}

export async function generateSitlabPosts(count = 2) {
  console.log(`  📚 시팅랩 ${count}개 생성 중...`);

  const text = await callClaude([{
    role: "user",
    content: `[시팅랩 발췌 스레드 생성]
생성 수: ${count}개

단계:
1. 아래 URL 방문해서 최신 글 목록 확인:
   https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all
2. 최신 글 3~5개에서 스레드에 올리기 좋은 인사이트 발굴
   기준: 숫자/데이터 | 반전 | 직장인 공감 | 몰랐던 사실
3. 각 글에서 핵심 인사이트 하나만 추출 (요약 금지)

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "source_title": "시팅랩 글 제목",
      "source_url": "해당 글 URL",
      "insight": "핵심 인사이트 한 줄",
      "format": "사용 형식",
      "post": "스레드 게시글 본문"
    }
  ]
}`,
  }]);

  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("  ⚠️ 시팅랩 게시글 생성 결과 없음");
    return [];
  }

  return parsed.posts.map((p) => ({
    type: "sitlab",
    source: p.source_title || "",
    angle: p.format || "",
    post: p.post || "",
    url: p.source_url || "",
    insight: p.insight || "",
  }));
}

export async function runAgent({ newsCount = 2, sitlabCount = 2 } = {}) {
  const [news, sitlab] = await Promise.all([
    generateNewsPosts(newsCount),
    generateSitlabPosts(sitlabCount),
  ]);
  const all = [...news, ...sitlab];
  console.log(`  ✅ 총 ${all.length}개 게시글 생성 완료`);
  return all;
}
