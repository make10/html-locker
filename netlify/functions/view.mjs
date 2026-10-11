// 업로드한 HTML을 실제 웹페이지로 보여주는 함수  (경로: /v/<id>)
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).pathname.split("/").filter(Boolean)[1];
  if (!id || !/^[a-z0-9]{6,32}$/i.test(id)) {
    return new Response("잘못된 주소입니다", { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const store = getStore({ name: "html-files", consistency: "strong" });
  const html = await store.get(id);
  if (html === null) {
    return new Response(
      `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
       <body style="font-family:sans-serif;padding:40px;text-align:center">
       <h2>파일을 찾을 수 없습니다</h2><p>삭제되었거나 주소가 틀렸습니다.</p><a href="/">← 목록으로</a></body>`,
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
      "x-robots-tag": "noindex",
    },
  });
};

export const config = { path: "/v/:id" };
