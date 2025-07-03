const Url = require("../models/Url");
const {
  validateUrl,
  generateShortCode,
  isValidShortCode,
} = require("../utils/urlValidator");
const { logger } = require("../middleware/logger");

// Create Short URL
const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    // Validate required fields
    if (!url) {
      logger.error("URL creation failed - Missing URL");
      return res.status(400).json({
        error: "URL is required",
        message: "Please provide a valid URL",
      });
    }

    // Validate URL format
    if (!validateUrl(url)) {
      logger.error("URL creation failed - Invalid URL format", { url });
      return res.status(400).json({
        error: "Invalid URL format",
        message: "Please provide a valid HTTP/HTTPS URL",
      });
    }

    // Set validity (default 30 minutes)
    const validityMinutes = validity || 30;
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

    let finalShortCode;

    // Handle custom shortcode
    if (shortcode) {
      if (!isValidShortCode(shortcode)) {
        logger.error("URL creation failed - Invalid shortcode format", {
          shortcode,
        });
        return res.status(400).json({
          error: "Invalid shortcode format",
          message: "Shortcode must be alphanumeric and 3-20 characters long",
        });
      }

      // Check if shortcode already exists
      const existingUrl = await Url.findOne({ shortCode: shortcode });
      if (existingUrl) {
        logger.error("URL creation failed - Shortcode already exists", {
          shortcode,
        });
        return res.status(409).json({
          error: "Shortcode already exists",
          message: "Please choose a different shortcode",
        });
      }

      finalShortCode = shortcode;
    } else {
      // Generate unique shortcode
      let attempts = 0;
      do {
        finalShortCode = generateShortCode();
        attempts++;

        if (attempts > 10) {
          logger.error(
            "URL creation failed - Unable to generate unique shortcode"
          );
          return res.status(500).json({
            error: "Unable to generate shortcode",
            message: "Please try again",
          });
        }
      } while (await Url.findOne({ shortCode: finalShortCode }));
    }

    const shortUrl = `${process.env.BASE_URL}/${finalShortCode}`;

    // Create new URL document
    const newUrl = new Url({
      originalUrl: url,
      shortCode: finalShortCode,
      shortUrl,
      expiresAt,
    });

    await newUrl.save();

    logger.info("Short URL created successfully", {
      shortCode: finalShortCode,
      originalUrl: url,
      expiresAt,
    });

    res.status(201).json({
      shortLink: shortUrl,
      expiry: expiresAt.toISOString(),
    });
  } catch (error) {
    logger.error("Error creating short URL", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to create short URL",
    });
  }
};

// Redirect to Original URL
const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      logger.error("Redirect failed - Short URL not found", { shortCode });
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Check if URL has expired
    if (urlDoc.expiresAt < new Date()) {
      logger.error("Redirect failed - Short URL expired", { shortCode });
      return res.status(410).json({
        error: "Short URL expired",
        message: "This short URL has expired",
      });
    }

    // Record click analytics
    const clickData = {
      timestamp: new Date(),
      referrer: req.get("Referer") || "",
      location: req.ip || "Unknown",
    };

    urlDoc.clicks.push(clickData);
    await urlDoc.save();

    logger.info("Successful redirect", {
      shortCode,
      originalUrl: urlDoc.originalUrl,
      clickCount: urlDoc.clicks.length,
    });

    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    logger.error("Error during redirect", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to redirect",
    });
  }
};

// Get URL Statistics
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      logger.error("Stats retrieval failed - Short URL not found", {
        shortCode,
      });
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    const stats = {
      shortCode: urlDoc.shortCode,
      originalUrl: urlDoc.originalUrl,
      shortUrl: urlDoc.shortUrl,
      totalClicks: urlDoc.clicks.length,
      createdAt: urlDoc.createdAt.toISOString(),
      expiresAt: urlDoc.expiresAt.toISOString(),
      isExpired: urlDoc.expiresAt < new Date(),
      clicks: urlDoc.clicks.map((click) => ({
        timestamp: click.timestamp.toISOString(),
        referrer: click.referrer,
        location: click.location,
      })),
    };

    logger.info("Stats retrieved successfully", {
      shortCode,
      totalClicks: stats.totalClicks,
    });

    res.json(stats);
  } catch (error) {
    logger.error("Error retrieving stats", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to retrieve statistics",
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginal,
  getUrlStats,
};
