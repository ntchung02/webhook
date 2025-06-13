const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

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
  try {
    const axios = require('axios');

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

    res.json(response.data);
  } catch (err) {
    console.error(err);
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
  console.log(`👋 Wake-up ping received at ${time} from IP: ${req.ip}`);
  res.send(`✅ Hello! Server đã được ping lúc ${time}`);
});
