const express = require("express");
const {} = require("../controllers/photosController");

const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();

router.route("/").get(protect, authorize("ADMIN", "SUPERADMIN"));

module.exports = router;
