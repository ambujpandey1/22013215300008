const validUrl = require("valid-url");

const validateUrl = (url) => {
  return validUrl.isWebUri(url);
};

const generateShortCode = (length = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const isValidShortCode = (shortCode) => {
  return /^[a-zA-Z0-9]{3,20}$/.test(shortCode);
};

module.exports = {
  validateUrl,
  generateShortCode,
  isValidShortCode,
};
