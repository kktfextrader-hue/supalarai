/******************************************************************
 * SuPalArai house-build — Google Apps Script backend
 * เก็บ DATA เป็นไฟล์ JSON ใน Drive (ตัวจริง) + sync สรุปลง Google Sheet
 *
 * วิธีใช้ (ดู setup-google.md):
 *  1) เปิด script.google.com → New project → วางไฟล์นี้
 *  2) แก้ค่า 3 ตัวด้านล่าง (TOKEN / FOLDER_ID / SHEET_ID)
 *  3) Deploy → New deployment → Web app
 *       - Execute as: Me (kktfextrader@gmail.com)
 *       - Who has access: Anyone
 *  4) Authorize → copy "Web app URL"
 *  5) เอา URL + TOKEN ไปใส่ในแอป (index.html: BACKEND_URL / BACKEND_TOKEN)
 ******************************************************************/

const TOKEN     = 'Home555';                                      // รหัสลับ ตรงกับ BACKEND_TOKEN ในแอป
const FOLDER_ID = '19N8ufXuS8icsH7DAoirfBGwoGHytILa6';            // โฟลเดอร์ homeproject
const SHEET_ID  = '1cpIijtr7si-9gBy6V8JV6cI1DqsJ00Hfc1jcfbC8utU'; // Google Sheet สรุป
const DATA_FILENAME = 'house-build-data.json';

/* ---------- โหลดข้อมูล / ดึงรูป ---------- */
function doGet(e){
  if (String(e.parameter.token||'') !== TOKEN) return _json({ok:false, error:'bad token'});
  if (e.parameter.action === 'image') return getImage(e.parameter.id);   // ดึงรูป (base64) ตาม fileId
  if (e.parameter.action === 'listBackups') return listBackups();
  if (e.parameter.action === 'getBackup') return getBackup(e.parameter.id);
  const f = _dataFile(false);
  const data = f ? JSON.parse(f.getBlob().getDataAsString() || 'null') : null;
  return _json({ok:true, data:data});
}

/* ---------- บันทึกข้อมูล / อัปโหลด-ลบรูป ---------- */
function doPost(e){
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch(err){ return _json({ok:false, error:'bad json'}); }
  if (String(body.token||'') !== TOKEN) return _json({ok:false, error:'bad token'});
  if (body.action === 'upload')   return uploadImage(body);
  if (body.action === 'delImage') return delImageFile(body.fileId);
  if (body.action === 'backup')   return backupData(body);
  // default = save ข้อมูลทั้งก้อน
  const f = _dataFile(true);
  f.setContent(JSON.stringify(body.data || {}));
  try { if (SHEET_ID) syncToSheet(body.data || {}); } catch(err){ /* ไม่ให้ล้มถ้าสรุปพลาด */ }
  return _json({ok:true, savedAt:new Date().toISOString()});
}

/* ---------- รูปภาพ: ไฟล์แยกในโฟลเดอร์ images/<หัวข้อ>/<หัวข้อย่อย> ---------- */
const IMAGES_ROOT = 'images';
function uploadImage(body){
  const folder = _imgFolder(body.secName || body.sec, body.sub);
  const dataUrl = String(body.dataUrl||'');
  const comma = dataUrl.indexOf(',');
  const mime  = dataUrl.substring(5, dataUrl.indexOf(';')) || 'image/jpeg';
  const bytes = Utilities.base64Decode(dataUrl.substring(comma+1));
  const file  = folder.createFile(Utilities.newBlob(bytes, mime, _fileName(body.title, body.name)));
  return _json({ok:true, fileId:file.getId(), name:file.getName()});
}
function getImage(id){
  try{ const blob = DriveApp.getFileById(id).getBlob();
    return _json({ok:true, dataUrl:'data:'+blob.getContentType()+';base64,'+Utilities.base64Encode(blob.getBytes())});
  }catch(err){ return _json({ok:false, error:'not found'}); }
}
function delImageFile(id){
  try{ DriveApp.getFileById(id).setTrashed(true); return _json({ok:true}); }
  catch(err){ return _json({ok:false, error:'not found'}); }
}

/* ---------- Backup (โฟลเดอร์ backups/ · 1 ไฟล์ต่อวัน · ไม่รวมรูป) ---------- */
function backupData(body){
  const folder = _subfolder(DriveApp.getFolderById(FOLDER_ID), 'backups');
  const name = 'backup-' + (body.date || Utilities.formatDate(new Date(),'GMT+7','yyyy-MM-dd')) + '.json';
  const content = JSON.stringify(body.data || {});
  const it = folder.getFilesByName(name);
  if (it.hasNext()) { const f = it.next(); f.setContent(content); return _json({ok:true, name:name, id:f.getId()}); }
  const f = folder.createFile(name, content, 'application/json');
  return _json({ok:true, name:name, id:f.getId()});
}
function listBackups(){
  const folder = _subfolder(DriveApp.getFolderById(FOLDER_ID), 'backups');
  const it = folder.getFiles(); const arr = [];
  while (it.hasNext()) { const f = it.next();
    arr.push({ id:f.getId(), name:f.getName(), at:Utilities.formatDate(f.getLastUpdated(),'GMT+7','yyyy-MM-dd HH:mm') }); }
  arr.sort(function(a,b){ return b.name.localeCompare(a.name); });
  return _json({ok:true, backups:arr});
}
function getBackup(id){
  try{ const f = DriveApp.getFileById(id);
    return _json({ok:true, data:JSON.parse(f.getBlob().getDataAsString() || 'null')});
  }catch(err){ return _json({ok:false, error:'not found'}); }
}
function _imgFolder(secName, sub){
  let f = _subfolder(DriveApp.getFolderById(FOLDER_ID), IMAGES_ROOT);
  f = _subfolder(f, _safe(secName||'อื่นๆ'));
  if (sub) f = _subfolder(f, _safe(sub));
  return f;
}
function _subfolder(parent, name){
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function _safe(s){ return String(s||'').replace(/[\/\\:*?"<>|]/g,'_').trim().slice(0,80) || 'อื่นๆ'; }
function _fileName(title, orig){
  const t = _safe(title).slice(0,40);
  const ext = (String(orig||'').match(/\.(\w+)$/)||[])[1] || 'jpg';
  const stamp = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd-HHmmss');
  return (t?t+'_':'') + stamp + '.' + ext;
}

/* ---------- helpers ---------- */
function _dataFile(createIfMissing){
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const it = folder.getFilesByName(DATA_FILENAME);
  if (it.hasNext()) return it.next();
  if (createIfMissing) return folder.createFile(DATA_FILENAME, '{}', 'application/json');
  return null;
}
function _json(o){
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- สรุปลง Google Sheet (1 ชีตต่อหัวข้อ + งบ + log) ---------- */
function syncToSheet(data){
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const CARD = {
    design:'ตัวบ้าน แบบบ้าน', env:'ภายนอกบ้าน', interior:'ภายในบ้าน',
    utility:'น้ำ-ไฟ', appliance:'เครื่องมือ-อุปกรณ์', library:'Library', idea:'idea'
  };
  Object.keys(CARD).forEach(function(key){
    const sh = _sheet(ss, CARD[key]);
    sh.clear();
    sh.appendRow(['หัวข้อย่อย','ชื่อ','สถานะ','ปรึกษา','ผู้รับผิดชอบ','ผู้สร้าง','วันเริ่ม','คาดเสร็จ','รายละเอียด','โน้ต','รูป']);
    (data[key]||[]).forEach(function(it){
      const notes = (it.notes||[]).map(function(n){ return '- '+n.text+' ('+(n.by||'')+(n.editedAt?(' แก้ '+n.editedAt):'')+')'; }).join('\n');
      sh.appendRow([it.sub||'', it.title||'', it.status||'', it.needHelp?'✔':'', it.owner||'',
        it.creator||'', it.created||'', it.due||'', it.detail||'', notes, (it.images||[]).length+' รูป']);
    });
  });
  // งบประมาณ
  const sb = _sheet(ss, 'งบประมาณ');
  sb.clear();
  sb.appendRow(['หมวด','งบที่ตั้งไว้','ใช้จริง','คงเหลือ','สถานะ']);
  (data.budget||[]).forEach(function(r){
    const p=+r.planned||0, a=+r.actual||0;
    sb.appendRow([r.title||'', p, a, p-a, r.status||'']);
  });
  // log
  const sl = _sheet(ss, 'log');
  sl.clear();
  sl.appendRow(['วันที่','เวลา','ผู้ทำ','หัวข้อ','การกระทำ']);
  (data.log||[]).forEach(function(e){ sl.appendRow([e.d||'', e.t||'', e.by||'', e.sec||'', e.action||'']); });
}
function _sheet(ss, name){
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}
