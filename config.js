// ==========================================
// ⚙️ config.js (แก้ไขให้ตรงกับ DB ของคุณ)
// ==========================================
const TAS_CONFIG = {
    // ⚠️ ใส่ KEY ANON (Public) ของคุณที่นี่
    SUPABASE_URL: "https://tdcmbskmlrwhbjrjyjkk.supabase.co",
    SUPABASE_KEY: "ใส่_KEY_ANON_ของคุณที่นี่", 
    
    // ชื่อตาราง (ต้องตรงกับใน DB เป๊ะๆ)
    TABLE_USER: "Personnel",      // ตัว P ใหญ่ ตาม SQL ที่ส่งมา
    TABLE_TIME: "TimeStampPlus"   // ตารางลงเวลา
};

// ==========================================
// 🔧 ระบบส่วนกลาง
// ==========================================
let sbClient = null;

function initSystem() {
    if (typeof window.supabase === 'undefined' || typeof Swal === 'undefined') {
        alert("❌ ไม่พบไฟล์ supabase.js หรือ sweetalert2.js");
        return false;
    }
    sbClient = window.supabase.createClient(TAS_CONFIG.SUPABASE_URL, TAS_CONFIG.SUPABASE_KEY);
    return true;
}

// เช็คสิทธิ์ (Level 1)
function checkAuth() {
    const stored = localStorage.getItem('tas_user');
    if (!stored) { window.location.href = 'login.html'; return null; }
    const user = JSON.parse(stored);
    
    // แปลงเป็น String กันเหนียว (เผื่อ DB ส่งมาเป็น number)
    if (String(user.level) !== '1') {
        alert("⛔ สิทธิ์ของคุณไม่ถูกต้อง (เฉพาะ Level 1)");
        localStorage.removeItem('tas_user');
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function logout() {
    Swal.fire({
        title: 'ออกจากระบบ?', icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#ef4444', confirmButtonText: 'ยืนยัน'
    }).then((r) => {
        if (r.isConfirmed) {
            localStorage.removeItem('tas_user');
            window.location.href = 'login.html';
        }
    });
}

function generateID() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const r = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${r}`;
}

function getDBDateString() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
}

initSystem();
