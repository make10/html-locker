// HTML 파일 목록 / 업로드 / 삭제 API  (경로: /api/files)
import { getStore } from "@netlify/blobs";

const MAX_BYTES = 4.5 * 1024 * 1024; // Netlify Functions 요청 한도(6MB) 안쪽

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const authorized = (req) => {
  const key = process.env.ACCESS_KEY;
  if (!key) return true; // 키를 설정하지 않으면 누구나 사용 가능
  return req.headers.get("x-access-key") === key;
};

const newId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

async function listAll(store) {
  const { blobs } = await store.list();
  const items = await Promise.all(
    blobs.map(async (b) => {
      const m = await store.getMetadata(b.key);
      return { id: b.key, ...(m?.metadata || {}) };
    })
  );
  return items.sort((a, b) => (b.updated || 0) - (a.updated || 0));
}

export default async (req) => {
  if (!authorized(req)) return json({ error: "접근 키가 올바르지 않습니다" }, 401);

  const store = getStore({ name: "html-files", consistency: "strong" });
  const url = new URL(req.url);

  try {
    if (req.method === "GET") {
      return json(await listAll(store));
    }

    if (req.method === "POST") {
      const { name, content } = await req.json();
      if (!name || !/\.html?$/i.test(name)) return json({ error: "HTML 파일만 올릴 수 있습니다" }, 400);
      if (typeof content !== "string") return json({ error: "내용이 비어 있습니다" }, 400);
      const size = new TextEncoder().encode(content).length;
      if (size > MAX_BYTES) return json({ error: "4.5MB를 넘는 파일은 올릴 수 없습니다" }, 413);

      // 같은 이름이 있으면 그 링크를 유지한 채 내용만 갱신
      const existing = (await listAll(store)).find((f) => f.name === name);
      const id = existing ? existing.id : newId();
      await store.set(id, content, { metadata: { name, size, updated: Date.now() } });
      return json({ id, updated: !!existing });
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id가 없습니다" }, 400);
      await store.delete(id);
      return json({ ok: true });
    }

    return json({ error: "지원하지 않는 요청" }, 405);
  } catch (e) {
    return json({ error: "서버 오류: " + e.message }, 500);
  }
};

export const config = { path: "/api/files" };
