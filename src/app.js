const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { consoleEndpointLogger } = require("./utils/logger");
const morganMiddleware = require("./middlewares/loggerMiddleware");
const connectDB = require("./config/database");
const app = express();
const passport = require("passport");
require("colors");

// Middleware setup
app.use(morganMiddleware);
app.use(consoleEndpointLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(passport.initialize());

connectDB();
// Routes
app.use("/api/v1", routes);

// Error Handling
app.use(errorHandler);

module.exports = app;
