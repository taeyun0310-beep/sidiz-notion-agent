import "dotenv/config";
import { runAgent } from "./agent.js";
import { saveToNotion } from "./notion.js";

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const count = parseInt(process.env.POST_COUNT || "1");

  console.log("━".repeat(48));
  console.log("🪑 시팅랩 스레드 에이전트");
  console.log(`📅 ${now}`);
  console.log(`⚙️  게시글 ${count}개`);
  if (isDryRun) console.log("🧪 DRY RUN — Notion 저장 생략");
  console.log("━".repeat(48));

  // 1. 게시글 생성 (시팅랩 스프레드시트 → AI 생성)
  const posts = await runAgent({ count });

  // 2. 미리보기 출력 (항상)
  const typeLabel = { observation: "관찰 글", debate: "논쟁 유발", tip: "생활 팁", trend: "트렌드 연결", magazine: "매거진 연결" };
  posts.forEach((p, i) => {
    console.log(`\n[${i + 1}/${posts.length}] ${typeLabel[p.type] || p.type}`);
    console.log(`출처: ${p.source}`);
    if (p.url) console.log(`링크: ${p.url}`);
    console.log("─".repeat(40));
    console.log(p.post);
  });

  // 3. Notion 저장 (dry-run이면 생략)
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
