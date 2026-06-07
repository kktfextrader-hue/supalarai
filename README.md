# 🏠 house-build — แผนสร้างบ้านครอบครัว

แยกออกจาก kkcallmd hub (ที่ใช้กับ clinic apps) เพื่อไม่ปนกัน

## โครงสร้างโฟลเดอร์
```
house-build/
├── README.md                   ← ไฟล์นี้
├── notion/                     ← Notion template (import เข้า Notion ได้)
│   ├── main-page.md            ← หน้าหลัก (paste เป็นเนื้อหาหน้า Notion)
│   ├── family-roles.md         ← guide ตั้งค่าสมาชิกครอบครัว + งาน
│   ├── decisions.csv           ← database "Decisions" (Phase 0 ตัดสินใจหลัก)
│   ├── tasks.csv               ← database "Tasks" (งานครบทุก phase + ผู้รับผิดชอบ)
│   ├── budget.csv              ← database "Budget" (งบรายหมวด)
│   ├── vendors.csv             ← database "Vendors" (สถาปนิก/ผู้รับเหมา/ซัพพลายเออร์)
│   └── milestones.csv          ← database "Milestones" (timeline)
├── notion-import-guide.md      ← วิธี import เข้า Notion
├── plan.md                     ← แผนเต็มแบบ markdown (ฉบับอ้างอิง)
└── kkcallmd/                   ← hub เฉพาะโปรเจกต์บ้าน (local-first)
    ├── README.md
    ├── planlist.md             ← งานบ้านรอตัดสินใจ (รหัส HOUSE-*)
    └── mustdo.md               ← สิ่งที่ห้ามพลาด (รหัส MUST-H*)
```

## เริ่มใช้

### ทาง Notion (แนะนำสำหรับครอบครัว)
1. เปิด Notion → สร้างหน้าใหม่ชื่อ "🏠 House Project"
2. import 5 ไฟล์ CSV เป็น databases (ดู `notion-import-guide.md`)
3. paste เนื้อหา `main-page.md` เป็น content ของหน้า
4. แก้ชื่อสมาชิกครอบครัวใน column "ผู้รับผิดชอบ" ของ Tasks/Decisions
5. แชร์หน้านี้ให้สมาชิกครอบครัว (Share → Invite)

### ทาง Local file (สำหรับ Claude/KK ใช้)
- `call house-plan` หรือ `call plan` → เปิด `plan.md`
- `call planlist` ในโฟลเดอร์นี้ → แสดง HOUSE-* (ไม่ปนกับ clinic)

## หลักการสำคัญ
- **ที่ดิน → งบ → ผู้อยู่ → แบบ → ก่อสร้าง** ห้ามสลับลำดับ
- ห้ามพลาด 5 ข้อ (อยู่ใน `kkcallmd/mustdo.md`: MUST-H1..H5)
