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
    // Gửi request thật đến MoMo server
    const response = await axios.head('https://test-payment.momo.vn', { timeout: 10000 });
    res.status(200).json({ success: true, momo_status: response.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
