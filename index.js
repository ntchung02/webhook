const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json()); // Parse application/json

// Momo credentials
const accessKey = "mjHEUVjfCewyaKbP";
const secretKey = "VCDbXIkfG8ag4aDxddNV4V66egEAb0Hz";
const partnerCode = "MOMORKPA20240709_TEST";

// Webhook route
app.post("/webhook", (req, res) => {
  const data = req.body;
  const signature = data.signature;
  delete data.signature;

  // Sort keys
  const sortedKeys = Object.keys(data).sort();
  const rawData = sortedKeys.map(key => `${key}=${data[key]}`).join("&");

  const generatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawData)
    .digest("hex");

  if (signature === generatedSignature) {
    console.log("✅ Webhook hợp lệ:", data);
    res.status(200).json({ message: "OK" });
  } else {
    console.log("❌ Sai chữ ký:", signature);
    res.status(400).json({ message: "Invalid signature" });
  }
});

app.get("/", (req, res) => res.send("Webhook đang hoạt động."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
