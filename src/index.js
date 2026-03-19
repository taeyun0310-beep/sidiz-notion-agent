import "dotenv/config";
import { runAgent } from "./agent.js";
import { saveToNotion } from "./notion.js";

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const newsCount  = parseInt(process.env.NEWS_POST_COUNT  || "2");
  const sitlabCount = parseInt(process.env.SITLAB_POST_COUNT || "2");

  console.log("━".repeat(48));
  console.log("🪑 시팅랩 스레드 에이전트");
  console.log(`📅 ${now}`);
  console.log(`⚙️  뉴스 ${newsCount}개 + 시팅랩 ${sitlabCount}개`);
  if (isDryRun) console.log("🧪 DRY RUN — Notion 저장 생략");
  console.log("━".repeat(48));

  // 1. 게시글 생성
  const posts = await runAgent({ newsCount, sitlabCount });

  // 2. 미리보기 출력 (항상)
  posts.forEach((p, i) => {
    console.log(`\n[${i + 1}/${posts.length}] ${p.type === "news" ? "📰 뉴스 연계" : "📚 시팅랩"}`);
    console.log(`출처: ${p.source}`);
    console.log("─".repeat(40));
    console.log(p.post);
  });

  // 3. Notion 저장 (dry-run 이면 생략)
  if (!isDryRun) {
    console.log("\n📤 Notion 저장 중...");
    await saveToNotion(posts);
  }

  console.log("\n✅ 완료");
}

main().catch((err) => {
  console.error("❌ 에이전트 오류:", err.message);
  process.exit(1);
});
