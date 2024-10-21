const express = require("express");
const {
  createVendor,
  getVendors,
  getVendorDetailAdmin,
  getUserDetailBySameUser,
  editVendorDetailAdmin,
} = require("../controllers/vendorController");
const { createProductSchemas } = require("../schemas/productSchema"); // Import the Zod schema
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const multer = require("multer");
const path = require("path");
const { upload, uploadErrorHandler } = require("../middlewares/multerConfig");
const router = express.Router();

router.route("/").post(protect, authorize("ADMIN", "SUPERADMIN"), createVendor);
router
  .route("/getvendors")
  .get(protect, authorize("ADMIN", "SUPERADMIN"), getVendors);
router
  .route("/getvendordetail/:id")
  .get(protect, authorize("ADMIN", "SUPERADMIN"), getVendorDetailAdmin);
router
  .route("/getvendordetail")
  .get(
    protect,
    authorize("VENDOR", "ADMIN", "SUPERADMIN"),
    getUserDetailBySameUser
  );

router.route("/:id").put(
  protect,
  // validateRequest(editUserDetailsSchema),
  authorize("ADMIN", "SUPERADMIN"),
  editVendorDetailAdmin
); // Өөрийнхөө USER мэдээллээ засна. !!! input validation saijruulah heregtei !!!

// router.route("/").get(getProducts);
// router.route("/:id").get(getProductDetails);

module.exports = router;
