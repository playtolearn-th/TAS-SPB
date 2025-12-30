// ==========================================
// ⚙️ การตั้งค่าระบบ (แก้ไขที่นี่ที่เดียว)
// ==========================================
const TAS_CONFIG = {
    // ⚠️ ใส่ KEY ใหม่ของคุณที่นี่
    SUPABASE_URL: "https://tdcmbskmlrwhbjrjyjkk.supabase.co",
    SUPABASE_KEY: "ใส่_KEY_ANON_ของคุณที่นี่", 
    
    // ชื่อตาราง
    TABLE_USER: "Personnel",
    TABLE_TIME: "TimeStampPlus"
};

// ==========================================
// 🔧 ระบบส่วนกลาง (ห้ามแก้ไข ถ้าไม่จำเป็น)
// ==========================================

// ตัวแปร Client กลาง
let sbClient = null;

// เริ่มต้นระบบ
function initSystem() {
    if (typeof window.supabase === 'undefined' || typeof Swal === 'undefined') {
        alert("❌ ไม่พบไฟล์ supabase.js หรือ sweetalert2.js");
        return false;
    }
    
    sbClient = window.supabase.createClient(TAS_CONFIG.SUPABASE_URL, TAS_CONFIG.SUPABASE_KEY);
    return true;
}

// ตรวจสอบสิทธิ์ (ต้อง Login และเป็น Level 1)
function checkAuth() {
    const stored = localStorage.getItem('tas_user');
    if (!stored) {
        window.location.href = 'login.html';
        return null;
    }
    
    const user = JSON.parse(stored);
    
    // บังคับ Level 1 เท่านั้น
    if (String(user.level) !== '1') {
        alert("⛔ สิทธิ์ของคุณไม่ถูกต้อง (Access Denied)");
        localStorage.removeItem('tas_user'); // ดีดออกเลย
        window.location.href = 'login.html';
        return null;
    }
    
    return user;
}

// ฟังก์ชันออกจากระบบ
function logout() {
    Swal.fire({
        title: 'ออกจากระบบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ยืนยัน'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('tas_user');
            window.location.href = 'login.html';
        }
    });
}

// สร้าง ID อัตโนมัติ (YYYYMMDDHHmmssRRRR)
function generateID() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    const r = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${yy}${mm}${dd}${h}${m}${s}${r}`;
}

// ฟังก์ชันแปลงวันที่สำหรับ DB (YYYY-MM-DD)
function getDBDateString() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// เรียกใช้งานทันทีเพื่อให้มีตัวแปร sbClient รอไว้
initSystem();
