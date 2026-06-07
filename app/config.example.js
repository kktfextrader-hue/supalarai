/* ===== Template — คัดลอกไฟล์นี้เป็น config.local.js แล้วเติมค่าจริง =====
   config.local.js ไม่ถูก push ขึ้น git (กันความลับรั่ว)
   ถ้าไม่มี config.local.js แอปจะทำงานแบบ localStorage อย่างเดียว (ไม่ sync) */
window.APP_CONFIG = {
  BACKEND_URL: '',     // Web App URL จาก Apps Script (ลงท้าย /exec)
  BACKEND_TOKEN: '',   // ต้องตรงกับ TOKEN ใน Code.gs
  ADMIN_PIN: ''        // รหัส 4 หลักของ admin
};
