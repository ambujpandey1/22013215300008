const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = {
  info: (message, data = null) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      message,
      data,
    };

    console.log(`[${logEntry.timestamp}] INFO: ${message}`, data || "");

    // Write to file
    fs.appendFileSync(
      path.join(logsDir, "app.log"),
      JSON.stringify(logEntry) + "\n"
    );
  },

  error: (message, error = null) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      message,
      error: error ? error.message : null,
      stack: error ? error.stack : null,
    };

    console.error(`[${logEntry.timestamp}] ERROR: ${message}`, error || "");

    // Write to file
    fs.appendFileSync(
      path.join(logsDir, "app.log"),
      JSON.stringify(logEntry) + "\n"
    );
  },
};

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
  });

  next();
};

module.exports = { logger, requestLogger };
