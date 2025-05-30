<?php
// Cấu hình
$endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
$partnerCode = "MOMORKPA20240709_TEST";
$accessKey = "mjHEUVjfCewyaKbP";
$secretKey = "VCDbXlkfG8ag4aDxddNV4V66egEAb0Hz";

// Lấy dữ liệu từ WooCommerce (hoặc test tạm)
$orderId = time() . "";
$requestId = time() . "";
$orderInfo = "Thanh toán đơn hàng #" . $orderId;
$amount = "1000"; // số tiền tạm test
$redirectUrl = "https://yourdomain.com/return";
$ipnUrl = "https://yourdomain.com/notify";
$extraData = "";

// Tạo chữ ký
$rawHash = "accessKey=" . $accessKey .
    "&amount=" . $amount .
    "&extraData=" . $extraData .
    "&ipnUrl=" . $ipnUrl .
    "&orderId=" . $orderId .
    "&orderInfo=" . $orderInfo .
    "&partnerCode=" . $partnerCode .
    "&redirectUrl=" . $redirectUrl .
    "&requestId=" . $requestId .
    "&requestType=captureWallet";

$signature = hash_hmac("sha256", $rawHash, $secretKey);

// Gửi dữ liệu đến Momo
$data = array(
    'partnerCode' => $partnerCode,
    'accessKey' => $accessKey,
    'requestId' => $requestId,
    'amount' => $amount,
    'orderId' => $orderId,
    'orderInfo' => $orderInfo,
    'redirectUrl' => $redirectUrl,
    'ipnUrl' => $ipnUrl,
    'extraData' => $extraData,
    'requestType' => "captureWallet",
    'signature' => $signature,
    'lang' => 'vi'
);

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$result = curl_exec($ch);
curl_close($ch);

// Trả kết quả
header('Content-Type: application/json');
echo $result;
