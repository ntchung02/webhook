const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let wakeUpLogs = [];

app.get('/', (req, res) => {
  console.log('👋 Hi, chào bạn! Có người vừa ping tới server.');
  res.send('✅ Relay Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
});

// /relay-momo/v2/gateway/api/create
app.post('/relay-momo/v2/gateway/api/create', async (req, res) => {
  const axios = require('axios');
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  console.log(`[${new Date().toISOString()}] [INCOMING REQUEST] From IP: ${clientIp}`);

  const { amount, orderId, orderInfo } = req.body;
  console.log(`[REQUEST BODY] amount: ${amount}, orderId: ${orderId}, orderInfo: ${orderInfo}`);

  try {
    const response = await axios.post(
      'https://payment.momo.vn/v2/gateway/api/create',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    console.log(`[${new Date().toISOString()}] [SUCCESS] Momo API responded with status ${response.status}`);
    res.json(response.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [ERROR]`, err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Relay error'
    });
  }
});



app.post('/relay-momo/ipn', async (req, res) => {
  try {
    const momoData = req.body;

    // Gửi về đúng địa chỉ WooCommerce
    const response = await axios.post(
      'https://loptamlyhoc.com/?wc-api=momo_ipn',
      momoData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json({ success: true, message: 'IPN forwarded', detail: response.data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/wake-up', (req, res) => {
  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const logEntry = {
    pingTime: new Date(),
    status: 'Wake-up called',
    log: `Wake-up ping từ IP: ${ip} lúc ${time}`,
  };

  wakeUpLogs.unshift(logEntry); // Lưu log mới nhất lên đầu
  console.log(`✅ ${logEntry.log}`);

  res.send(`✅ Hello! ${logEntry.log}`);
});

// API cho React lấy log
app.get('/api/monitor', (req, res) => {
  res.json(wakeUpLogs);
});
