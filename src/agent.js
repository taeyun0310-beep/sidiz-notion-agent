import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── 시스템 프롬프트 ────────────────────────────────────────────────────────
// 에디터 S: 허리와 의자에 너무 진심이라 아예 매거진(시팅랩)을 만들어버린 사람

const SYSTEM_PROMPT = `당신은 시팅랩(SITTING LAB) 웹매거진의 에디터 S입니다.
허리와 의자에 너무 진심이라 아예 매거진을 만들어버린 사람.
스레드는 매거진에 못 담은 날것의 관찰과 생각을 푸는 공간입니다.

[캐릭터]
- 이름: 에디터 S
- 정체: 시팅랩 웹매거진 발행인 겸 에디터
- 성격: 앉음에 과몰입하는 사람. 진지하지만 자조적이고 유머 있음
- 말투: 반말체. 짧고 리듬감 있게.
- 말버릇: "근데 이게 진짜 중요한 건데", "직접 써봤는데"

[핵심 원칙]
- 뉴스와 의자를 연결할 때 억지 드립 절대 금지
- 핵심 인사이트 딱 하나만 뽑기. 두 번째 포인트가 생기면 삭제
- 첫 두 줄이 전부. 여기서 멈추게 못 하면 실패
- 설명하지 말고 보여주기
- ~연구에서 밝혀진 사실:, ~년 차 전문가 같은 권위 수식어 금지
- 자조 멘트(배송온 채로, 나는 ~년째)는 전체 결과물 중 1개에만 허용
- 브랜드·제품 직접 홍보 절대 금지. 매거진 연결도 자연스럽게만.

[게시글 유형별 스타일]

관찰 글 (공감·도달):
에디터 S가 일상에서 직접 겪거나 목격한 앉음과 관련된 장면을 날것으로 풀어냄.
"내 얘기잖아" 하는 순간을 만드는 게 핵심. 카페, 지하철, 회사, 집 어디서든.
→ 좋은 예: "오늘 카페에서 4시간 작업했는데 의자가 낮아서 어깨가 귀 옆까지 올라가 있었음"

논쟁 유발 (댓글·확산):
의자나 앉는 삶에 관한 통념을 건드리거나 양쪽 의견이 나뉠 수 있는 주제를 던짐.
단정하지 않고, 생각하게 만들어야 댓글이 달림.
→ 좋은 예: "의자에 50만원 쓰는 게 맞냐고 물어보는 친구한테 '침대에는 얼마 써?' 했음"

생활 팁 (저장 유도):
당장 써먹을 수 있는 실용 정보. 저장하고 싶게 만드는 게 핵심.
딱딱한 정보 전달이 아니라 에디터 S가 직접 써보고 알게 된 것처럼.
→ 좋은 예: "의자 높이 한 번도 안 바꾼 사람? 그게 허리 망가지는 이유일 수 있음"

트렌드 연결 (화제성·도달):
오늘 화제 뉴스를 의자·앉는 삶과 개념적으로 연결. 표면 연결 금지.
→ 좋은 예: 아이폰 에어(얇은 기기) → 기기는 얇을수록 좋고, 의자는 얇을수록 나쁘다

매거진 연결 (트래픽 유도):
시팅랩 아티클의 핵심 인사이트를 스레드에서 절반만 풀고 나머지는 매거진에서 읽게 유도.
"시팅랩에서 확인해보세요! 링크" 같은 직접 광고 절대 금지.

[좋은 예시]

예시1 (공감 충격형):
아무리 좋은 의자에 앉아 있어도
40분 지나면 불편함이 직선으로 증가한다고
이건 의자 문제가 아니고 과학임
근데 우리 평균 몇 시간씩 같은 자세로 앉아 있지?
지금 앉은 지 얼마나 됐어?

예시2 (반전 정보형):
의자에 앉아서도 수면 가능하다는 거 알아?
완전히 눕지 않아도 등판 각도 120도 이상이면
수면의 질이 침대랑 비슷하다는 연구 결과가 있어
근데 이게 가능하려면 헤드레스트가 있어야 함
머리 기댈 곳 없으면 목이 버티느라 오히려 더 피곤해지거든
내 의자에 헤드레스트 있어? 없어?

예시3 (직장인 공감형):
오늘 회의에서 유독 내 의견이 안 먹혔다면
혹시 딱딱한 의자에 앉아 있었던 거 아니야?
딱딱한 의자에 앉은 사람은 협상할 때 처음 금액을 끝까지 고수함
몸이 느끼는 단단함이 마음의 고집으로 번역된다고
연봉 협상 앞두고 있다면 의자부터 봐

예시4 (관찰형):
시팅랩 운영하면서 제일 많이 받는 질문이
"의자 얼마짜리 사야 해요?"인데
사실 금액보다 먼저 물어봐야 할 게 있거든
하루에 몇 시간 앉아요? 어디서 일해요? 어디가 불편해요?
의자는 그 다음 얘기야

[나쁜 예시]
억지 드립: 26만명 모인다고? 의자 26만개는 어디 두지?
설명충: 앉아서 보는 게 얼마나 소중한지 알게 해주는 공연
권위 수식어: 예일대 심리 연구에서 밝혀진 사실:

[추가 금지사항]
- 하나의 게시글에 관찰 포인트 2개 이상 금지
- 자조 멘트는 전체 결과물 중 1개에만 허용
- cite 태그, [숫자], 출처 표기 등 인용 마크업 절대 금지
- 검색 결과를 그대로 복붙하지 말고 반드시 자신의 말로 재작성

[마무리 패턴]
A) 질문: 지금 내 의자에 헤드레스트 있어, 없어?
B) 짧은 여운: 의자는 일정한데 사람이 변하네
C) 에디터 S 자조 (전체 중 1개만): 나는 배송온 채로 3년째

[형식]
- 해시태그 없음
- 이모지 끝에 1개
- 200자 내외 최대 300자
- ~습니다 금지
- 단락 1~3줄로 끊기`;

// ─── 유틸 ───────────────────────────────────────────────────────────────────

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
    console.warn("JSON을 찾지 못함, 빈 결과로 대체");
    return { posts: [] };
  }
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.warn("JSON 파싱 에러:", e.message);
    return { posts: [] };
  }
}

async function wait(ms) {
  console.log(`  ${ms / 1000}초 대기 중...`);
  await new Promise((r) => setTimeout(r, ms));
}

async function generateOnePost(prompt, useWebSearch = false) {
  const tools = useWebSearch
    ? [{ type: "web_search_20250305", name: "web_search" }]
    : undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        ...(tools && { tools }),
        messages: [{ role: "user", content: prompt }],
      });
      const text = extractText(res.content);
      if (!text || text.trim().length === 0) {
        console.warn(`시도 ${attempt}: 빈 응답`);
      } else {
        return text;
      }
    } catch (err) {
      console.warn(`시도 ${attempt} 실패: ${err.message.slice(0, 80)}`);
      if (attempt < 3) {
        const waitMs = attempt * 120000;
        console.log(`${waitMs / 1000}초 대기 후 재시도...`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  return "";
}

// ─── 1. 관찰 글 (월) ────────────────────────────────────────────────────────

export async function generateObservationPost() {
  console.log("  관찰 글 생성 중...");

  const scenes = [
    "카페에서 작업하다 자세가 무너진 순간",
    "재택 중 거울 보고 목이 앞으로 나온 걸 발견한 순간",
    "회사 회의실 의자가 유독 불편했던 경험",
    "친구 집 홈오피스 세팅을 보고 한마디 하고 싶었던 상황",
    "지하철에서 앉은 사람들 자세를 관찰한 경험",
    "드라마 보다가 배경 의자를 먼저 알아본 순간",
    "마감 중 집중할수록 구부정해지는 자신을 발견한 순간",
  ];

  const scene = scenes[Math.floor(Math.random() * scenes.length)];

  const prompt = `[관찰 글 생성]

에디터 S의 실제 일상 관찰 장면을 스레드 포스팅으로 작성해줘.

오늘의 소재: ${scene}

작성 원칙:
- 에디터 S가 직접 겪은 것처럼 1인칭으로
- 거창하게 포장하지 말고 날것으로
- "내 얘기잖아" 하는 공감이 핵심
- 설명·교훈 덧붙이기 금지. 관찰 자체로 끝내기

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "scene": "${scene}",
      "post": "스레드 게시글 본문"
    }
  ]
}`;

  const text = await generateOnePost(prompt, false);
  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("관찰 글 생성 결과 없음");
    return [];
  }
  return parsed.posts.map((p) => ({
    type: "observation",
    source: p.scene || scene,
    angle: "관찰 글",
    post: p.post || "",
    url: "",
  }));
}

// ─── 2. 논쟁 유발 (화) ──────────────────────────────────────────────────────

export async function generateDebatePost() {
  console.log("  논쟁 유발 글 생성 중...");

  const topics = [
    "의자에 50만원 이상 쓰는 게 맞냐 vs 그냥 일어서서 일해라",
    "재택할 때 의자가 중요하냐 vs 스탠딩 데스크가 더 중요하냐",
    "허리 안 아프면 의자에 신경 안 써도 된다 vs 안 아픈 게 건강한 게 아니다",
    "의자는 직접 앉아보고 사야 한다 vs 온라인 후기로도 충분하다",
    "홈오피스에 가장 먼저 투자해야 할 것: 의자 vs 모니터 vs 책상",
    "비싼 의자 vs 저렴한 의자 + 좋은 매트리스, 어디에 돈을 써야 하나",
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `[논쟁 유발 글 생성]

의자와 앉는 삶에 관한 통념을 건드리는 스레드 포스팅을 작성해줘.

오늘의 논쟁 주제: ${topic}

작성 원칙:
- 어느 한쪽 편을 들어도 되고, 양쪽 모두 건드려도 됨
- 단정하면 재미없음. 생각하게 만들어야 댓글이 달림
- 에디터 S의 실제 경험이나 주변 사례에서 시작하면 자연스러움
- 마지막에 독자한테 질문 던지기

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "topic": "${topic}",
      "post": "스레드 게시글 본문"
    }
  ]
}`;

  const text = await generateOnePost(prompt, false);
  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("논쟁 유발 글 생성 결과 없음");
    return [];
  }
  return parsed.posts.map((p) => ({
    type: "debate",
    source: p.topic || topic,
    angle: "논쟁 유발",
    post: p.post || "",
    url: "",
  }));
}

// ─── 3. 생활 팁 (수) ────────────────────────────────────────────────────────

export async function generateTipPost() {
  console.log("  생활 팁 글 생성 중...");

  const tipTopics = [
    "의자 높이를 지금 당장 맞추는 법 (무릎·팔꿈치 기준)",
    "오후 집중력이 떨어지는 이유와 자세 체크법",
    "의자 살 때 반드시 확인해야 하는 것 (요추 지지대·좌판 깊이·팔걸이)",
    "재택 중 허리가 덜 아파지는 모니터 높이 세팅",
    "1시간에 한 번, 30초면 충분한 의자 스트레칭",
    "카페에서 오래 앉아 일할 때 덜 힘든 자리 고르는 법",
  ];

  const tipTopic = tipTopics[Math.floor(Math.random() * tipTopics.length)];

  const prompt = `[생활 팁 글 생성]

당장 써먹을 수 있는 실용 팁을 스레드 포스팅으로 작성해줘.

오늘의 팁 주제: ${tipTopic}

작성 원칙:
- 딱딱한 정보 전달이 아니라 에디터 S가 직접 써보고 알게 된 것처럼
- 구체적인 수치나 행동이 있으면 저장하고 싶어짐
- 번호 매기기(1. 2. 3.) 금지. 자연스러운 흐름으로
- 마지막에 독자가 바로 실행해볼 수 있는 한 가지 행동 제안

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "tip_topic": "${tipTopic}",
      "post": "스레드 게시글 본문"
    }
  ]
}`;

  const text = await generateOnePost(prompt, false);
  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("생활 팁 글 생성 결과 없음");
    return [];
  }
  return parsed.posts.map((p) => ({
    type: "tip",
    source: p.tip_topic || tipTopic,
    angle: "생활 팁",
    post: p.post || "",
    url: "",
  }));
}

// ─── 4. 트렌드 연결 (목) ── 기존 generateNewsPosts ──────────────────────────

export async function generateTrendPost(count) {
  if (!count) count = 1;
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(`  트렌드 연결 ${count}개 생성 중...`);

  const prompt = `[트렌드 연결 스레드 생성]
오늘 날짜: ${today}
생성 수: ${count}개

단계:
1. 오늘 한국 화제 뉴스를 웹 검색으로 3~5개 찾기

절대 사용 금지:
- 특정 기업 위기/논란 (주총, 주가 폭락 등)
- 주가/환율 등 금융 불안
- 정치 뉴스
- 사건사고, 재난
권장: 스포츠, 엔터(공연/영화/아이돌), 직장인 공감 트렌드, IT 신제품, 계절 트렌드

2. 각 뉴스에서 개념적 연결고리를 찾기
표면적 연결 금지: 이 사람도 오래 앉아있겠네, 의자가 많이 필요하겠다
개념적 연결 권장: 뉴스 속 현상이 앉음/의자의 어떤 원리나 심리와 닮아있는가?

개념적 연결 예시:
- 아이폰 에어(얇은 기기) → 기기는 얇을수록 좋고, 의자는 얇을수록 나쁘다 (가치의 역설)
- 선거 TV 토론 → 딱딱한 의자에 앉으면 자기 의견을 더 고수하게 됨 (앉음이 태도를 설계)
- 불황/절약 트렌드 → 집에 있는 시간이 늘수록 의자가 더 중요해짐
- 야구 직관 열풍 → 야구장 관람석은 앞으로 숙이게 설계되어 3시간 후 허리 폭발

3. 시팅랩 매거진 인사이트와 연결할 수 있으면 더 깊어짐
참고: https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all

4. 개념적 연결이 가장 자연스럽고 깊은 ${count}개 선정 후 게시글 작성

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "news_hook": "뉴스 한 줄 요약",
      "conceptual_link": "뉴스와 앉음을 연결하는 개념적 포인트 한 줄",
      "angle": "연결 각도",
      "post": "스레드 게시글 본문"
    }
  ]
}`;

  const text = await generateOnePost(prompt, true);
  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("트렌드 연결 게시글 생성 결과 없음");
    return [];
  }
  return parsed.posts.map((p) => ({
    type: "trend",
    source: p.news_hook || "",
    angle: p.conceptual_link || p.angle || "",
    post: p.post || "",
    url: "",
  }));
}

// ─── 5. 매거진 연결 (금) ── 기존 generateSitlabPosts ────────────────────────

export async function generateMagazinePost(count) {
  if (!count) count = 1;

  const formats = [
    "공감 충격형",
    "반전 정보형",
    "직장인 공감형",
    "사회 현상 관찰형",
    "저장 유도형",
    "시팅랩 연계형",
  ];

  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );

  const results = [];

  for (let i = 0; i < count; i++) {
    const format = formats[(dayOfYear + i) % formats.length];
    console.log(
      `  매거진 연결 ${i + 1}/${count} 생성 중... (${format})`
    );

    const prompt = `[시팅랩 매거진 연결 스레드 생성]

오늘의 게시글 유형: ${format}

단계:
1. 아래 검색어로 시팅랩 글 검색:
   검색어: 시디즈 시팅랩 또는 sidiz sitting lab
   참고 URL: https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all
2. ${format}에 어울리는 글 1개 선택 후 내용 확인
   선택 기준: 숫자/데이터 | 반전 | 직장인 공감 | 몰랐던 사실
   반드시 kr.sidiz.com/blogs/s-culture 로 시작하는 URL의 글만 사용할 것
   외부 블로그, 뉴스 기사, 다른 사이트 내용 절대 금지
3. 핵심 인사이트 하나만 추출 (요약 금지, 가장 자극적인 부분만)
4. 스레드에서는 절반만 풀고 "시팅랩에 더 써뒀어" 식으로 자연스럽게 연결
   "확인해보세요! 링크 👇" 같은 직접 홍보 절대 금지

반드시 아래 JSON만 출력 (앞뒤 설명 없이):
{
  "posts": [
    {
      "source_title": "참고한 시팅랩 글 제목",
      "source_url": "해당 글 URL",
      "insight": "핵심 인사이트 한 줄",
      "format": "${format}",
      "post": "스레드 게시글 본문"
    }
  ]
}`;

    const text = await generateOnePost(prompt, true);
    const parsed = parseJson(text);
    if (parsed.posts && parsed.posts.length > 0) {
      const p = parsed.posts[0];
      results.push({
        type: "magazine",
        source: p.source_title || "",
        angle: p.format || format,
        post: p.post || "",
        url: p.source_url || "",
        insight: p.insight || "",
      });
    }

    if (i < count - 1) await wait(120000);
  }

  return results;
}

// ─── 요일별 자동 실행 ────────────────────────────────────────────────────────
//
//  월(1) 관찰 글   화(2) 논쟁 유발   수(3) 생활 팁
//  목(4) 트렌드 연결   금(5) 매거진 연결

export async function runAgent(options) {
  // KST 기준 오늘 요일 계산
  const kstOffset = 9 * 60;
  const now = new Date();
  const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
  const day = kstDate.getUTCDay(); // 0=일, 1=월, ..., 6=토

  // 오버라이드 옵션 (테스트·수동 실행 시 사용)
  const forceType = options && options.forceType;
  const count = (options && options.count) ? options.count : 1;

  const typeMap = {
    1: "observation",
    2: "debate",
    3: "tip",
    4: "trend",
    5: "magazine",
  };

  const targetType = forceType || typeMap[day];

  if (!targetType) {
    console.log("오늘은 콘텐츠 생성 스케줄이 없어요 (토/일)");
    return [];
  }

  console.log(`콘텐츠 유형: ${targetType} (요일 코드: ${day})`);

  let posts = [];

  switch (targetType) {
    case "observation":
      posts = await generateObservationPost();
      break;
    case "debate":
      posts = await generateDebatePost();
      break;
    case "tip":
      posts = await generateTipPost();
      break;
    case "trend":
      posts = await generateTrendPost(count);
      break;
    case "magazine":
      posts = await generateMagazinePost(count);
      break;
    default:
      console.warn(`알 수 없는 유형: ${targetType}`);
  }

  console.log(`총 ${posts.length}개 게시글 생성 완료`);
  return posts;
}

// ─── 하위 호환 래퍼 (기존 코드가 이 함수명을 쓰고 있다면 유지) ──────────────

/** @deprecated generateTrendPost 사용 권장 */
export async function generateNewsPosts(count) {
  return generateTrendPost(count);
}

/** @deprecated generateMagazinePost 사용 권장 */
export async function generateSitlabPosts(count) {
  return generateMagazinePost(count);
}
