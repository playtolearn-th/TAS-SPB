// ไฟล์นี้ต้องอยู่ที่: /netlify/functions/fetch-web.js
// หากยังไม่มีโฟลเดอร์ ให้สร้าง netlify และ functions ซ้อนกันใน root project ของคุณ

exports.handler = async (event, context) => {
  // รองรับทั้ง GET และ POST
  const params = event.queryStringParameters;
  const targetUrl = params.url;

  // ตรวจสอบว่ามี URL ส่งมาไหม
  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'url' query parameter" })
    };
  }

  try {
    console.log(`Proxying request to: ${targetUrl}`);
    
    // ตรวจสอบว่ามี fetch ใน environment หรือไม่ (Node 18+ มีมาให้เลย)
    const fetchFn = global.fetch || require('node-fetch');

    // ดึงข้อมูลจาก URL ปลายทาง
    const response = await fetchFn(targetUrl, {
      method: 'GET',
      headers: {
        // แอบอ้าง User-Agent เพื่อป้องกันการบล็อกเบื้องต้นจาก Firewall บางตัว
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // หากปลายทาง Error
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Error fetching target: ${response.statusText}`
      };
    }

    // อ่านข้อมูลเป็น Text (HTML)
    // ใช้ arrayBuffer แล้ว convert เป็น buffer เพื่อรองรับการเข้ารหัสภาษาไทยที่ถูกต้อง (บางครั้ง text() อาจเพี้ยนถ้า charset ไม่ชัดเจน)
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8'); // หรือ 'tis-620' ถ้าเว็บต้นทางเป็นภาษาไทยเก่า
    const data = decoder.decode(buffer);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // อนุญาตให้ทุกโดเมนเรียกใช้ (สำคัญมากสำหรับ CORS)
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "text/html; charset=utf-8"
      },
      body: data
    };

  } catch (error) {
    console.error("Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
