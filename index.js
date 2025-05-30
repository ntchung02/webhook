require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const app = express();
app.use(express.json());

const {
  MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
  MOMO_ENDPOINT,
  WOOCOMMERCE_URL,
  WOOCOMMERCE_KEY,
  WOOCOMMERCE_SECRET,
} = process.env;

// ⚡️ Tạo đơn MoMo
app.post("/create-payment", async (req, res) => {
  const { orderId, amount, orderInfo } = req.body;

  const requestId = orderId.toString();
  const redirectUrl = "https://yourdomain.com/return";
  const ipnUrl = "https://your-node-server.onrender.com/ipn";
  const extraData = "";

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  try {
    const response = await axios.post(MOMO_ENDPOINT, body, {
      headers: { "Content-Type": "application/json" },
    });

    const payUrl = response.data.payUrl;
    res.json({ payUrl });
  } catch (error) {
    console.error("Momo error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create MoMo payment" });
  }
});

// ✅ IPN / Callback nhận từ MoMo
app.post("/ipn", async (req, res) => {
  const { orderId, resultCode, message } = req.body;

  if (resultCode === 0) {
    try {
      await axios.put(
        `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`,
        { status: "processing" },
        {
          auth: {
            username: WOOCOMMERCE_KEY,
            password: WOOCOMMERCE_SECRET,
          },
        }
      );
    } catch (err) {
      console.error("Update order error:", err.response?.data || err.message);
    }
  }

  res.json({ message: "IPN received" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
