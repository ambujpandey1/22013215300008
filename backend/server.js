require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");
const { logger } = require("./src/middleware/logger");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
