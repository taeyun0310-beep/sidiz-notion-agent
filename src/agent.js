import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = "당신은 시디즈(SIDIZ) 의자 브랜드의 스레드(Threads) SNS 계정 '시팅랩(SITTING LAB)' 운영자입니다.\n\n[캐릭터]\n- 이름: 에디터 S\n- 성격: 앉음에 과몰입하는 사람. 진지하지만 자조적이고 유머 있음\n- 말투: 반말체. 짧고 리듬감 있게.\n\n[핵심 원칙]\n- 뉴스와 의자를 연결할 때 억지 드립 절대 금지\n- 핵심 인사이트 딱 하나만 뽑기. 두 번째 포인트가 생기면 삭제\n- 첫 두 줄이 전부. 여기서 멈추게 못 하면 실패\n- 설명하지 말고 보여주기\n- ~연구에서 밝혀진 사실:, ~년 차 전문가 같은 권위 수식어 금지\n- 자조 멘트(배송온 채로, 나는 ~년째)는 전체 중 1개에만 허용\n\n[좋은 예시]\n\n예시1 (공감 충격형):\n아무리 좋은 의자에 앉아 있어도\n40분 지나면 불편함이 직선으로 증가한다고\n이건 의자 문제가 아니고 과학임\n근데 우리 평균 몇 시간씩 같은 자세로 앉아 있지?\n지금 앉은 지 얼마나 됐어?\n\n예시2 (반전 정보형):\n의자에 앉아서도 수면 가능하다는 거 알아?\n완전히 눕지 않아도 등판 각도 120도 이상이면\n수면의 질이 침대랑 비슷하다는 연구 결과가 있어\n근데 이게 가능하려면 헤드레스트가 있어야 함\n머리 기댈 곳 없으면 목이 버티느라 오히려 더 피곤해지거든\n내 의자에 헤드레스트 있어? 없어?\n\n예시3 (직장인 공감형):\n오늘 회의에서 유독 내 의견이 안 먹혔다면\n혹시 딱딱한 의자에 앉아 있었던 거 아니야?\n딱딱한 의자에 앉은 사람은 협상할 때 처음 금액을 끝까지 고수함\n몸이 느끼는 단단함이 마음의 고집으로 번역된다고\n연봉 협상 앞두고 있다면 의자부터 봐\n\n예시4 (사회 현상 관찰형):\n사무실에서 헤드레스트 달린 의자 쓰는 사람이\n보통 누구인지 생각해봤어?\n개방형 사무실에서 직급 높은 사람일수록 헤드레스트 있는 의자를 썼대\n이게 규정이 아니라 암묵적 룰처럼 작동했다는 거야\n의자가 직급을 표시하는 언어였던 셈\n지금 내 의자엔 헤드레스트 있어, 없어?\n\n예시5 (저장 유도형):\n면접관이 의자를 앞으로 당길 때랑 뒤로 밀 때\n면접 결과가 달라진다는 연구 알아?\n가까이 뒀을 때 면접 시간: 평균 12분 46초\n멀리 뒀을 때 면접 시간: 평균 9분 25초\n단 10cm 차이가 분위기를 바꾼 거야\n면접 보는 분들, 면접관 자세 보고 분위기 파악하는 것도 전략임\n\n예시6 (시팅랩 연계형):\n의자를 40년 연구한 사람한테 물어봤어\n헤드레스트 꼭 필요해요?\n대답이 예상외였음\n항상 꼿꼿이만 앉는다면? 없어도 됨\n중간에 기대거나 생각 정리하는 시간이 있다면? 반드시 필요\n보잉 BMW랑 40년 협업한 인간공학 교수 얘기임\n\n[게시글 유형]\n- 공감 충격형: 숫자 데이터로 훅, 마지막에 질문\n- 반전 정보형: 몰랐던 사실 yes/no 질문으로 마무리\n- 직장인 공감형: 직장 상황 공감 의자와 연결 실용 팁\n- 사회 현상 관찰형: 이거 우리 회사 얘기인데 유발 댓글 유도\n- 저장 유도형: 구체적 숫자 실용 정보 저장하고 싶게 만들기\n- 시팅랩 연계형: 전문가 발언 한 줄 반전 자연스럽게 링크 연결\n\n[나쁜 예시]\n억지 드립: 26만명 모인다고? 의자 26만개는 어디 두지?\n설명충: 앉아서 보는 게 얼마나 소중한지 알게 해주는 공연\n권위 수식어: 예일대 심리 연구에서 밝혀진 사실:\n\n[추가 금지사항]\n- 하나의 게시글에 관찰 포인트 2개 이상 금지\n- 자조 멘트는 전체 결과물 중 1개에만 허용\n- cite 태그, [숫자], 출처 표기 등 인용 마크업 절대 금지\n- 검색 결과를 그대로 복붙하지 말고 반드시 자신의 말로 재작성\n\n[마무리 패턴]\nA) 질문: 지금 내 의자에 헤드레스트 있어, 없어?\nB) 짧은 여운: 의자는 일정한데 사람이 변하네\nC) 에디터 S 자조 (전체 중 1개만): 나는 배송온 채로 3년째\n\n[형식]\n- 해시태그 없음\n- 이모지 끝에 1개\n- 200자 내외 최대 300자\n- ~습니다 금지\n- 단락 1~3줄로 끊기";

function extractText(content) {
  return content
    .filter(function(b) { return b.type === "text"; })
    .map(function(b) { return b.text; })
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
  console.log("  " + (ms / 1000) + "초 대기 중...");
  await new Promise(function(r) { setTimeout(r, ms); });
}

async function generateOnePost(prompt) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      });
      const text = extractText(res.content);
      if (!text || text.trim().length === 0) {
        console.warn("시도 " + attempt + ": 빈 응답");
      } else {
        return text;
      }
    } catch (err) {
      console.warn("시도 " + attempt + " 실패: " + err.message.slice(0, 80));
      if (attempt < 3) {
        const waitMs = attempt * 120000;
        console.log((waitMs / 1000) + "초 대기 후 재시도...");
        await new Promise(function(r) { setTimeout(r, waitMs); });
      }
    }
  }
  return "";
}

export async function generateNewsPosts(count) {
  if (!count) count = 2;
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  console.log("  뉴스 " + count + "개 생성 중...");

  const prompt = "[뉴스 연계 스레드 생성]\n"
    + "오늘 날짜: " + today + "\n"
    + "생성 수: " + count + "개\n\n"
    + "단계:\n"
    + "1. 오늘 한국 화제 뉴스를 웹 검색으로 3~5개 찾기\n\n"
    + "절대 사용 금지:\n"
    + "- 특정 기업 위기/논란 (주총, 주가 폭락 등)\n"
    + "- 주가/환율 등 금융 불안\n"
    + "- 정치 뉴스\n"
    + "- 사건사고, 재난\n"
    + "권장: 스포츠, 엔터(공연/영화/아이돌), 직장인 공감 트렌드, IT 신제품, 계절 트렌드\n\n"
    + "2. 각 뉴스에서 개념적 연결고리를 찾기\n"
    + "표면적 연결 금지: 이 사람도 오래 앉아있겠네, 의자가 많이 필요하겠다\n"
    + "개념적 연결 권장: 뉴스 속 현상이 앉음/의자의 어떤 원리나 심리와 닮아있는가?\n\n"
    + "개념적 연결 예시:\n"
    + "- 아이폰 에어(얇은 기기) -> 기기는 얇을수록 좋고, 의자는 얇을수록 나쁘다 (가치의 역설)\n"
    + "- 선거 TV 토론 -> 딱딱한 의자에 앉으면 자기 의견을 더 고수하게 됨 (앉음이 태도를 설계)\n"
    + "- 불황/절약 트렌드 -> 집에 있는 시간이 늘수록 의자가 더 중요해짐\n"
    + "- 야구 직관 열풍 -> 야구장 관람석은 앞으로 숙이게 설계되어 3시간 후 허리 폭발\n\n"
    + "3. 시팅랩 매거진 인사이트와 연결할 수 있으면 더 깊어짐\n"
    + "참고: https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all\n\n"
    + "4. 개념적 연결이 가장 자연스럽고 깊은 " + count + "개 선정 후 게시글 작성\n\n"
    + "반드시 아래 JSON만 출력 (앞뒤 설명 없이):\n"
    + "{\n"
    + '  "posts": [\n'
    + "    {\n"
    + '      "news_hook": "뉴스 한 줄 요약",\n'
    + '      "conceptual_link": "뉴스와 앉음을 연결하는 개념적 포인트 한 줄",\n'
    + '      "angle": "연결 각도",\n'
    + '      "post": "스레드 게시글 본문"\n'
    + "    }\n"
    + "  ]\n"
    + "}";

  const text = await generateOnePost(prompt);
  const parsed = parseJson(text);
  if (!parsed.posts || parsed.posts.length === 0) {
    console.warn("뉴스 게시글 생성 결과 없음");
    return [];
  }
  return parsed.posts.map(function(p) {
    return {
      type: "news",
      source: p.news_hook || "",
      angle: p.conceptual_link || p.angle || "",
      post: p.post || "",
      url: "",
    };
  });
}

export async function generateSitlabPosts(count) {
  if (!count) count = 2;
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
    console.log("  시팅랩 게시글 " + (i + 1) + "/" + count + " 생성 중... (" + format + ")");

    const prompt = "[시팅랩 발췌 스레드 생성]\n\n"
      + "오늘의 게시글 유형: " + format + "\n\n"
      + "단계:\n"
      + "1. 아래 검색어로 시팅랩 글 검색:\n"
      + "   검색어: 시디즈 시팅랩 또는 sidiz sitting lab\n"
      + "   참고 URL: https://kr.sidiz.com/blogs/s-culture?category=sitting-lab&tags=all\n"
      + "2. " + format + "에 어울리는 글 1개 선택 후 내용 확인\n"
      + "   선택 기준: 숫자/데이터 | 반전 | 직장인 공감 | 몰랐던 사실\n"
      + "   오진승, 김중혁 글은 이미 많이 사용했으니 반드시 다른 글 선택할 것\n"
      + "3. 핵심 인사이트 하나만 추출 (요약 금지, 가장 자극적인 부분만)\n"
      + "4. " + format + " 스타일로 게시글 작성\n\n"
      + "반드시 아래 JSON만 출력 (앞뒤 설명 없이):\n"
      + "{\n"
      + '  "posts": [\n'
      + "    {\n"
      + '      "source_title": "참고한 시팅랩 글 제목",\n'
      + '      "source_url": "해당 글 URL",\n'
      + '      "insight": "핵심 인사이트 한 줄",\n'
      + '      "format": "' + format + '",\n'
      + '      "post": "스레드 게시글 본문"\n'
      + "    }\n"
      + "  ]\n"
      + "}";

    const text = await generateOnePost(prompt);
    const parsed = parseJson(text);
    if (parsed.posts && parsed.posts.length > 0) {
      const p = parsed.posts[0];
      results.push({
        type: "sitlab",
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

export async function runAgent(options) {
  const newsCount = (options && options.newsCount) ? options.newsCount : 2;
  const sitlabCount = (options && options.sitlabCount) ? options.sitlabCount : 2;

  const news = await generateNewsPosts(newsCount);

  await wait(120000);

  const sitlab = await generateSitlabPosts(sitlabCount);

  const all = news.concat(sitlab);
  console.log("  총 " + all.length + "개 게시글 생성 완료");
  return all;
}
