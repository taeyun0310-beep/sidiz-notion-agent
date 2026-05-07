import { google } from "googleapis";

const SPREADSHEET_ID = "1KOJiv7mdD5gYYHFKBt7Yal3nDMmdrGxSEbnKnqKk6Zo";
const SHEET_NAME = "원고 및 컨텐츠 아카이빙";

async function fetchRows() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const apiKey = process.env.GOOGLE_API_KEY;
  const range = `${SHEET_NAME}!A:H`;

  if (serviceAccountJson) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountJson),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    return res.data.values || [];
  }

  if (apiKey) {
    const encodedRange = encodeURIComponent(range);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sheets API 오류 ${res.status}`);
    const data = await res.json();
    return data.values || [];
  }

  throw new Error(
    "Google Sheets 인증 필요: GOOGLE_SERVICE_ACCOUNT_JSON 또는 GOOGLE_API_KEY 환경변수를 설정하세요."
  );
}

function parseRows(rows) {
  if (rows.length < 2) return [];

  // 헤더 행 탐색 (발행월 셀이 있는 행)
  let headerIdx = rows.findIndex((row) =>
    row.some((cell) => String(cell).trim() === "발행월")
  );
  if (headerIdx === -1) headerIdx = 0;

  const headers = rows[headerIdx].map((h) => String(h).trim());
  const find = (keywords) =>
    headers.findIndex((h) => keywords.some((k) => h.includes(k)));

  const col = {
    month: find(["발행월"]),
    theme: find(["테마"]),
    category: find(["구분"]),
    title: find(["주제"]),
    content: find(["원고"]),
    url: find(["업로드", "URL"]),
  };

  const get = (row, c) => (c >= 0 ? (row[c] || "").trim() : "");

  return rows
    .slice(headerIdx + 1)
    .filter((row) => get(row, col.title))
    .map((row) => ({
      month: get(row, col.month),
      theme: get(row, col.theme),
      category: get(row, col.category),
      title: get(row, col.title),
      content: get(row, col.content),
      url: get(row, col.url),
    }));
}

export async function fetchSitlabArticles() {
  console.log("  시팅랩 아티클 로드 중...");
  const rows = await fetchRows();
  const articles = parseRows(rows);
  console.log(`  ✓ ${articles.length}개 아티클 로드`);
  return articles;
}

// used 셋에 없는 아티클 중 랜덤 선택 (풀 소진 시 전체 풀에서 재선택)
export function pickArticle(articles, used = new Set()) {
  const pool = articles.filter((a) => !used.has(a.title));
  const source = pool.length > 0 ? pool : articles;
  return source[Math.floor(Math.random() * source.length)];
}
