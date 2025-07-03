const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "Unknown",
  },
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format",
    },
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: [clickSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
});

// Add indexes for better performance
urlSchema.index({ shortCode: 1 });
urlSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("Url", urlSchema);
