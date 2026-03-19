import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_DATABASE_ID;

// ─────────────────────────────────────────────────────────────────────
// Notion DB 컬럼 구성 (DB 만들 때 아래 컬럼 추가 필요)
//
//  컬럼명     타입      설명
//  ────────  ──────   ─────────────────────────────
//  제목       Title    자동 생성 (건드리지 않아도 됨)
//  유형       Select   뉴스 연계 / 시팅랩 발췌
//  게시글     Text     스레드 본문
//  출처       Text     뉴스 훅 또는 시팅랩 글 제목
//  인사이트    Text     핵심 인사이트 or 연결 각도
//  링크       URL      시팅랩 원문 URL (뉴스는 비워둠)
//  상태       Select   초안 / 검토 / 발행 완료
//  생성일     Date     자동 입력
// ─────────────────────────────────────────────────────────────────────

export async function saveToNotion(posts) {
  const today = new Date().toISOString().split("T")[0];
  let saved = 0;

  for (const post of posts) {
    const isNews = post.type === "news";
    const title = `[${today}] ${(post.source || "").slice(0, 45)}`;

    try {
      await notion.pages.create({
        parent: { database_id: DB_ID },
        properties: {
          제목: {
            title: [{ text: { content: title } }],
          },
          유형: {
            select: { name: isNews ? "뉴스 연계" : "시팅랩 발췌" },
          },
          게시글: {
            rich_text: [{ text: { content: post.post || "" } }],
          },
          출처: {
            rich_text: [{ text: { content: post.source || "" } }],
          },
          인사이트: {
            rich_text: [{ text: { content: post.angle || post.insight || "" } }],
          },
          ...(post.url && {
            링크: { url: post.url },
          }),
          상태: {
            select: { name: "초안" },
          },
          생성일: {
            date: { start: today },
          },
        },
        // 페이지 본문: 게시글 전문 + 메타 정보
        children: [
          {
            type: "callout",
            callout: {
              icon: { type: "emoji", emoji: "🪑" },
              rich_text: [{ text: { content: post.post || "" } }],
              color: "gray_background",
            },
          },
          { type: "divider", divider: {} },
          {
            type: "heading_3",
            heading_3: {
              rich_text: [{ text: { content: "메타 정보" } }],
            },
          },
          {
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                { text: { content: `유형: ${isNews ? "뉴스 연계" : "시팅랩 발췌"}` } },
              ],
            },
          },
          {
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                { text: { content: `출처: ${post.source || ""}` } },
              ],
            },
          },
          {
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: `인사이트/각도: ${post.angle || post.insight || ""}`,
                  },
                },
              ],
            },
          },
          ...(post.url
            ? [
                {
                  type: "bulleted_list_item",
                  bulleted_list_item: {
                    rich_text: [
                      {
                        text: { content: "원문: " },
                      },
                      {
                        text: { content: post.url },
                        href: post.url,
                      },
                    ],
                  },
                },
              ]
            : []),
        ],
      });

      saved++;
      console.log(`  ✓ Notion 저장: ${title}`);
    } catch (err) {
      console.error(`  ✗ 저장 실패: ${title} →`, err.message);
    }
  }

  console.log(`  📋 Notion: ${saved}/${posts.length}개 저장`);
}
