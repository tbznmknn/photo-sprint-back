const express = require("express");
const { createOrder } = require("../controllers/orderController");
const { createProductSchemas } = require("../schemas/productSchema"); // Import the Zod schema
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const multer = require("multer");
const path = require("path");
const { upload, uploadErrorHandler } = require("../middlewares/multerConfig");
const router = express.Router();

router.route("/createproduct").post(
  protect,
  authorize("CUSTOMER", "VENDOR", "ADMIN", "SUPERADMIN"),

  createOrder
);
// router.route("/").get(getProducts);
// router.route("/:id").get(getProductDetails);

module.exports = router;
