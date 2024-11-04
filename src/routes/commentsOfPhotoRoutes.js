const express = require("express");
const { addPhotoComment } = require("../controllers/photosController");

const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();

router.route("/").get(protect, authorize("ADMIN", "SUPERADMIN"));
router.route("/:id").post(addPhotoComment);

module.exports = router;
