const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const MOMO_CREATE_URL = 'https://test-payment.momo.vn/v2/gateway/api/create';

app.post('/create-order', async (req, res) => {
  try {
    const response = await axios.post(MOMO_CREATE_URL, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.json(response.data); // Gửi lại kết quả MoMo trả về
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Relay error', detail: err.message });
  }
});

app.get('/', (req, res) => {
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
    console.log('📩 IPN Received from MoMo:', JSON.stringify(momoData, null, 2));

    const response = await axios.post(
      'https://loptamlyhoc.com/?wc-api=momo_ipn',
      momoData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json({ success: true, message: 'IPN forwarded to WooCommerce', detail: response.data });
  } catch (err) {
    console.error('❌ Relay IPN failed:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

