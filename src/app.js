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
const path = require("path");
// Project 7 Libraries
const session = require("express-session");
const bodyParser = require("body-parser");
require("colors");

// Middleware setup
app.use(morganMiddleware);
app.use(consoleEndpointLogger);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30days
      httpOnly: true,
      // sameSite: "None",
    },
  })
);
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(passport.initialize());

connectDB();
// Routes
app.use("/api/v1", routes);
console.log(path.join(__dirname, "../uploads"));
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handling
app.use(errorHandler);

module.exports = app;
