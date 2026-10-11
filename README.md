# 📂 HTML 보관함 (Netlify용)

PC나 휴대폰에서 HTML 파일을 올리면 `https://내사이트.netlify.app/v/xxxx` 링크가 생겨,
스마트폰에서 앱처럼 바로 열립니다. (열기 · 링크 복사 · 카톡 공유 · QR 코드 · 삭제)

같은 이름의 파일을 다시 올리면 **링크는 그대로 두고 내용만 갱신**됩니다.

## 폴더 구성
```
html-locker/
├─ public/index.html            ← 업로드·목록 화면
├─ netlify/functions/files.mjs  ← 업로드/목록/삭제 API
├─ netlify/functions/view.mjs   ← /v/<id> 로 HTML 보여주기
├─ netlify.toml
└─ package.json
```

## 배포 방법 (택1)

> ⚠️ Netlify 웹사이트에 폴더를 **끌어다 놓는 방식(Netlify Drop)은 서버 함수가 동작하지 않습니다.** 아래 둘 중 하나로 올리세요.

### A. GitHub 연결 (추천 — 이후 수정이 편함)
1. GitHub에 새 저장소를 만들고 이 폴더 내용을 올립니다.
2. Netlify → **Add new site → Import an existing project → GitHub** → 저장소 선택
3. 설정은 `netlify.toml`이 자동으로 채우므로 그대로 **Deploy** 누르면 끝.

### B. Netlify CLI (PC에 Node.js 설치 필요)
```bash
cd html-locker
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
```
처음 실행 시 "Create & configure a new site"를 선택하세요.

## 🔑 접근 키 (꼭 설정 권장)
키를 설정하지 않으면 사이트 주소를 아는 사람 누구나 파일을 올리고 지울 수 있습니다.

1. Netlify → 사이트 → **Site configuration → Environment variables**
2. `ACCESS_KEY` = 원하는 비밀번호 추가 → **Deploys → Trigger deploy** 로 재배포
3. 화면 아래 "🔑 접근 키" 칸에 같은 값을 입력하고 저장 (기기마다 한 번씩)

※ 파일 **보기 링크(/v/…)는 키 없이 열립니다.** 링크가 무작위 12자리라 추측은 어렵지만,
링크를 받은 사람은 볼 수 있으니 민감한 자료는 주의하세요.

## 스마트폰에서 앱처럼 쓰기
- 아이폰(사파리): 공유 버튼 → **홈 화면에 추가**
- 안드로이드(크롬): ⋮ 메뉴 → **홈 화면에 추가**

## 제한
- 파일 1개당 약 **4.5MB**까지 (이미지를 base64로 넣은 큰 HTML은 초과할 수 있음)
- HTML 안에서 **같은 폴더의 다른 파일(이미지·js·css)을 상대경로로 불러오는 경우**는 함께 열리지 않습니다.
  한 파일 안에 모두 들어 있는(인라인) HTML이나 CDN 링크를 쓰는 HTML은 정상 동작합니다.
- 저장소는 Netlify Blobs(무료 플랜 포함)를 사용합니다.
