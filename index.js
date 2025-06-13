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


app.post('/test', async (req, res) => {
  try {
    const payload = {
      partnerCode: "MOMORKPA20240709_TEST",
      accessKey: "mjHEUVjfCewyaKbP",
      requestId: "test123456789",
      amount: "10000",
      orderId: "order123456789",
      orderInfo: "Test kết nối",
      redirectUrl: "https://google.com",
      ipnUrl: "https://webhook.site/test",
      requestType: "captureWallet",
      extraData: "",
      lang: "vi",
      signature: "signature-test" // Dùng tạm hoặc tạo đúng nếu cần
    };

    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).json({
      success: true,
      momo_response: response.data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      detail: err.response?.data || null
    });
  }
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
