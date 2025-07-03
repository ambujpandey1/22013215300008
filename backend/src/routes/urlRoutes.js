const express = require("express");
const {
  createShortUrl,
  redirectToOriginal,
  getUrlStats,
} = require("../controllers/urlController");

const router = express.Router();

// Create short URL
router.post("/shorturls", createShortUrl);

// Get URL statistics
router.get("/shorturls/:shortCode", getUrlStats);

// Redirect to original URL
router.get("/:shortCode", redirectToOriginal);

module.exports = router;
