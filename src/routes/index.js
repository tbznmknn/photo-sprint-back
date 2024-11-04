const express = require("express");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const photoRoutes = require("./photoRoutes");
const commentsOfPhotoRoutes = require("./commentsOfPhotoRoutes");

const router = express.Router();

router.use("/admin", adminRoutes); //++++++
router.use("/user", userRoutes); //++++++
router.use("/commentsOfPhoto", commentsOfPhotoRoutes); //++++++
router.use("/photos", photoRoutes); //++++++

module.exports = router;
