# 📥 วิธี import เข้า Notion

## 1) สร้างหน้าหลัก
- เปิด Notion → ปุ่ม "+ New page" → ตั้งชื่อ **🏠 House Project**
- เปิดไฟล์ `notion/main-page.md` → copy ทั้งหมด → paste ลงในหน้า Notion (Notion จะแปลง markdown ให้อัตโนมัติ)

## 2) Import 5 databases (CSV)

สำหรับแต่ละไฟล์ใน `notion/`:
1. ในหน้า "🏠 House Project" → พิมพ์ `/database` → เลือก **Database - Inline**
2. ตั้งชื่อ database (เช่น "Decisions", "Tasks", "Budget", "Vendors", "Milestones")
3. คลิก **...** (มุมขวาบนของ database) → **Merge with CSV** → เลือกไฟล์ CSV
4. รอ Notion import เสร็จ

### ลำดับ import (แนะนำ)
| ไฟล์ | ชื่อ database | View ที่แนะนำ |
|---|---|---|
| `decisions.csv` | 📋 Decisions | Table + filter by สถานะ |
| `tasks.csv` | ✅ Tasks | Kanban by ผู้รับผิดชอบ + Table by Phase |
| `budget.csv` | 💰 Budget | Table + sum งบ/ใช้จริง |
| `vendors.csv` | 🤝 Vendors | Gallery (ใส่รูปได้) |
| `milestones.csv` | 📅 Milestones | Timeline view |

## 3) ปรับ Property types หลัง import

Notion จะ import เป็น Text หมด — เปลี่ยน type ให้ถูก:

### Decisions
- **สถานะ** → Select (รอตัดสินใจ / ตัดสินใจแล้ว / ยกเลิก)
- **ผู้รับผิดชอบ** → Person (หรือ Multi-select ถ้ายังไม่ invite)
- **กำหนดเสร็จ** → Date
- **Phase** → Select

### Tasks
- **สถานะ** → Select (รอเริ่ม / กำลังทำ / รออนุมัติ / เสร็จ / ติดปัญหา)
- **ผู้รับผิดชอบ** → Person / Multi-select
- **กำหนดเสร็จ** → Date
- **Phase** → Select
- **Priority** → Select (🔴 ด่วน / 🟠 สำคัญ / 🟡 ปกติ)

### Budget
- **งบที่ตั้งไว้, ใช้จริง, ส่วนต่าง** → Number (format: บาท)
- **สถานะ** → Select

### Vendors
- **ประเภท** → Select
- **Rating** → Select (⭐⭐⭐⭐⭐)
- **สถานะ** → Select (กำลังคุย / ได้ใบเสนอราคา / เลือก / ไม่เลือก)

### Milestones
- **เริ่ม, เสร็จ** → Date
- **สถานะ** → Select
- **Owner** → Person / Multi-select

## 4) ตั้งค่าครอบครัว
- ไปที่ Settings & members → Invite members → ใส่อีเมลสมาชิก
- กลับมาที่ Tasks/Decisions/Milestones → เปลี่ยน column ผู้รับผิดชอบ → Person type → tag คนจริง

## 5) Tips
- **Linked database** ใน main-page: หลัง import เสร็จ ลาก database แต่ละตัวมา embed ในหน้าหลักด้วย `/linked` (Linked view of database)
- **View แยกตามคน:** ใน Tasks → New view → Filter "ผู้รับผิดชอบ = [ชื่อ]" → ตั้งชื่อ view "ของพ่อ", "ของแม่"
- **Notification:** ตั้ง reminder ที่ column "กำหนดเสร็จ" → คนรับผิดชอบจะได้ noti อัตโนมัติ
