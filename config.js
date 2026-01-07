// ==========================================
// ⚙️ config.js (แก้ไขให้ตรงกับ DB ของคุณ)
// ==========================================
const TAS_CONFIG = {
    // ⚠️ ใส่ KEY ANON (Public) ของคุณที่นี่
    SUPABASE_URL: "https://tdcmbskmlrwhbjrjyjkk.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY21ic2ttbHJ3aGJqcmp5amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTY4NTYsImV4cCI6MjA3ODE5Mjg1Nn0.FeYe75J8X_2LoQgG_JWyPNCKcuCL_otsmSW0s5bijAg",

    // ชื่อตาราง (ต้องมีครบ 4 บรรทัดนี้)
    TABLE_USER: "Personnel",
    TABLE_SETTINGS: "Settings",
    TABLE_TARGET: "TimeStamp"
};

// ==========================================
// 🔧 ระบบส่วนกลาง
// ==========================================
let sbClient = null;

function initSystem() {
    if (typeof window.supabase === 'undefined') return false;
    sbClient = window.supabase.createClient(TAS_CONFIG.SUPABASE_URL, TAS_CONFIG.SUPABASE_KEY);
    return true;
}

function checkAuth() {
    const stored = localStorage.getItem('tas_user');
    if (!stored) { window.location.href = 'login.html'; return null; }
    const user = JSON.parse(stored);
    if (String(user.level) !== '1') {
        alert("⛔ Access Denied"); window.location.href = 'login.html'; return null;
    }
    return user;
}

function logout() {
    localStorage.removeItem('tas_user');
    window.location.href = 'login.html';
}

function generateID() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const r = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${r}`;
}

initSystem();
