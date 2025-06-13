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
