# 🔗 คู่มือเชื่อม SuPalArai → Google Drive + Sheets

> สถาปัตยกรรม: แอป (index.html) → **Apps Script Web App** → ไฟล์ JSON ใน Drive (ตัวจริง) + สรุปลง Google Sheet
> ใช้บัญชี **kktfextrader@gmail.com** ทำทั้งหมด

---

## เตรียม 2 อย่างใน Drive ก่อน

1. **โฟลเดอร์ `homeproject`** — เปิดโฟลเดอร์ใน Drive แล้วดู URL:
   `https://drive.google.com/drive/folders/`**`<FOLDER_ID>`** ← ก๊อปส่วนนี้
   > ⚠️ ถ้า `homeproject` อยู่ใน "Shared with me" ให้คลิกขวา → **Add shortcut to Drive** (หรือ Organize → Add to My Drive) ก่อน เพื่อให้สคริปต์เข้าถึงง่าย · แล้วใช้ FOLDER_ID เดิมได้

2. **Google Sheet สรุป** — สร้างชีตเปล่า 1 ไฟล์ (ชื่ออะไรก็ได้ เช่น "SuPalArai สรุป") เก็บไว้ในโฟลเดอร์ก็ได้
   ดู URL: `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit` ← ก๊อปส่วนนี้

---

## ทำ Apps Script (5 ขั้น)

1. ไป **script.google.com** → **New project**
2. ลบโค้ดเดิม → วางทั้งหมดจาก **`Code.gs`** (ในโฟลเดอร์นี้)
3. แก้ 3 บรรทัดบนสุด:
   ```js
   const TOKEN     = 'ตั้งรหัสลับเอง';     // เช่น 'home2569kk'
   const FOLDER_ID = '<FOLDER_ID>';        // จากข้อ 1
   const SHEET_ID  = '<SHEET_ID>';         // จากข้อ 2 (เว้น '' ได้ถ้ายังไม่อยากสรุป)
   ```
4. **Deploy** → **New deployment** → เลือกชนิด **Web app**
   - Description: house-build
   - **Execute as: Me** (kktfextrader@gmail.com)
   - **Who has access: Anyone**
   - กด **Deploy** → **Authorize access** → เลือกบัญชี → Advanced → Go to (unsafe) → Allow
5. ก๊อป **Web app URL** (ลงท้าย `/exec`)

---

## ใส่ค่าในแอป

เปิด `app/index.html` หา block นี้ (ราวบรรทัด 380) แล้วเติม 2 ค่า:
```js
const BACKEND_URL='<Web app URL จากข้อ 5>';
const BACKEND_TOKEN='<TOKEN เดียวกับใน Code.gs>';
```
เซฟ → Ctrl+F5

---

## ตรวจว่าใช้ได้
- มุมขวาบน header จะขึ้น **"☁️ ซิงค์แล้ว"** เมื่อบันทึกสำเร็จ
- ลองแก้อะไรสักอย่าง → เปิดไฟล์ `house-build-data.json` ในโฟลเดอร์ Drive จะเห็นข้อมูลอัปเดต
- เปิด Google Sheet → จะมีชีตแยกแต่ละหัวข้อ + งบประมาณ + log
- ถ้าขึ้น **"⚠️ ออฟไลน์"** = เชื่อม backend ไม่ได้ (เช็ค URL/TOKEN/สิทธิ์) — แอปยังทำงานได้ด้วย localStorage

---

## หมายเหตุ / ระยะต่อไป
- **รูปภาพ** ตอนนี้ฝังเป็น base64 ในไฟล์ JSON → ถ้าแนบเยอะไฟล์จะใหญ่ · เฟสถัดไปแนะนำย้ายรูปไปเก็บเป็นไฟล์แยกในโฟลเดอร์ Drive แล้วเก็บแค่ลิงก์
- **ความปลอดภัย**: Web App แบบ "Anyone" ใครมี URL+TOKEN ก็เรียกได้ — เหมาะกับใช้ในครอบครัว · ถ้าต้องการแน่นหนาขึ้นค่อยทำ OAuth ภายหลัง
- Sheet เป็น **สรุปอ่านอย่างเดียว** (สคริปต์ overwrite ทุกครั้งที่ save) — แก้ใน Sheet โดยตรงจะถูกเขียนทับ ให้แก้ผ่านแอปเท่านั้น
