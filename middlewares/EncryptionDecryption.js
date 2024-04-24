const CryptoJS = require("crypto-js");

const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptResponse = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {

    const iv = CryptoJS.lib.WordArray.random(16)
    const encryptedBody = CryptoJS.AES.encrypt(
      JSON.stringify(body),
      encryptionKey,
      { iv: iv }
    ).toString();

    res.set("Content-Type", "application/json");
    res.set("Encryption", "AES");
    res.set("IV", iv.toString(CryptoJS.enc.Base64));

    originalSend.call(this, encryptedBody);
  };
  next();
};

const decryptRequest = (req, res, next) => {
  if (req.headers["encryption"] === "AES") {
    const encryptedData = req.body;
    const iv = req.headers["iv"]; // Get the IV from the request headers

    const decryptedData = CryptoJS.AES.decrypt(encryptedData, encryptionKey, {
      iv: CryptoJS.enc.Base64.parse(iv),
    }).toString(CryptoJS.enc.Utf8);

    req.body = JSON.parse(decryptedData);
  }

  next();
};

module.exports={encryptResponse,decryptRequest}

