# 🛠 app-spec.md — Custom Web App (Phase 2)

> Decision 2026-06-07: **ทำคู่กัน** (dual-track)
> - **Notion** = วางแผน/ระดมสมอง/collaboration เบาๆ — ทำก่อน ใช้ได้เร็ว (prompt: `notion/notion-ai-prompt.md`)
> - **Custom app** = ตัวจริง เก็บข้อมูลใน Google Drive + role field-level + keep login → port ข้อมูลจาก Notion เข้าทีหลังได้

---

## 🏗 Architecture (สถาปัตยกรรมแบบ clinic apps)
- **Frontend:** single-file HTML/CSS/JS (แนวเดียวกับ superclinic) · responsive (มือถือ+เดสก์ท็อป)
- **Backend:** Google Apps Script Web App
- **Storage:** Shared Drive ของ `kktfextrader@gmail.com`
  - **Database** → Google Sheet (1 ชีต/หัวข้อ) หรือ JSON ใน Drive
  - **รูปภาพ/ไฟล์** → โฟลเดอร์ใน shared drive (อัปโหลดผ่าน Apps Script + Drive API)
- **Auth:** user/password → token เก็บใน `localStorage` (= keep login) แบบ token pattern ของ clinic
- **Role:** ตาราง `users` (ชื่อ · role · sections ที่ดูแล) → frontend เปิด/ปิดสิทธิ์แก้ตาม section

## 🔢 10 หัวข้อ → mapping
| # | requirement | ทำใน app ยังไง |
|---|---|---|
| 1-6 | สิ่งแวดล้อม/น้ำไฟ/แบบบ้าน/ตกแต่ง/เครื่องใช้ไฟฟ้า/งบ | 6 section pages · CRUD ต่อ section · ชีตละหัวข้อ |
| 7 | login + แก้เฉพาะส่วนตัวเอง | section ownership ผูกกับ user · field-level gating |
| 8 | ความคืบหน้า | dashboard rollup status จากทุก section |
| 9 | keep login | token ใน localStorage (auto re-login) |
| 10 | เก็บใน Google Drive ของ kktfextrader | Apps Script เขียน Sheet + Drive folder ใน shared drive |

## 🖥 Modules / หน้าจอ
- **Login** (+ จำ session)
- **Dashboard** — % เสร็จต่อหมวด + งานล่าสุด + งบรวม
- **6 Section pages** — สิ่งแวดล้อม · น้ำไฟ · แบบบ้าน · ตกแต่ง · เครื่องใช้ไฟฟ้า · งบ
- **รูปภาพ/ไฟล์** — อัปโหลด → โฟลเดอร์ Drive (ผูกกับ section/row)
- **Admin** — จัดการ users + กำหนด role/sections

## 📦 Build phases (build ทีละก้อน — verify ก่อนไปต่อ)
- `APP-A` scaffold + login + keep-login token + 1 section CRUD เขียนลง Drive Sheet ✅ proof-of-concept
- `APP-B` ครบ 6 sections + role gating (แก้เฉพาะ section ตัวเอง)
- `APP-C` upload รูป/ไฟล์ → Drive folder
- `APP-D` dashboard ความคืบหน้า + budget formula
- `APP-E` import ข้อมูลจาก Notion (ถ้าใช้ Notion ไปก่อน)

## ✅ ต้องเตรียม (จากเจ้าของโครงการ)
1. **สร้าง Shared Drive** ใน `kktfextrader@gmail.com` (ผมแนะนำขั้นตอนได้) → ตั้งชื่อ เช่น "House-Build-Data"
2. **รายชื่อ users + sections ที่แต่ละคนดูแล** (เช่น พ่อ=งบ+แบบบ้าน, แม่=ตกแต่ง+เครื่องใช้ไฟฟ้า)
3. **ที่ deploy:** เปิด Apps Script Web App (เหมือน clinic) — ผม guide ได้

## 🔒 หมายเหตุความปลอดภัย
- token เก็บ localStorage = สะดวก แต่ควรมี expiry + logout (clinic ใช้ static token ได้เพราะ low-risk; house app ครอบครัว = OK)
- Shared Drive ต้อง add สมาชิกที่เกี่ยวข้องเป็น content manager/contributor
- รูปภาพบ้าน/แบบ = ไม่ sensitive มาก แต่ข้อมูลงบ = ควร gate ด้วย role
