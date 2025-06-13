// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TARGET_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create'; // nơi bạn muốn nhận dữ liệu

app.post('/momo-relay', async (req, res) => {
  try {
    const response = await axios.post(TARGET_ENDPOINT, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(response.status).send({
      message: 'Đã relay thành công',
      momoResponse: response.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Relay thất bại', error: error.message });
  }
});

app.listen(3000, () => console.log('Relay server đang chạy tại http://localhost:3000'));
