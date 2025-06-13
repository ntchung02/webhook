const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

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


