const express = require("express");
const {
  addPhoto,
  getPhotoDetail,
  toggleLikePhoto,
  deletePhoto,
} = require("../controllers/photosController");
const upload = require("../middlewares/multerConfig");
const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();
const path = require("path");
router.route("/new").post(protect, upload.single("file"), addPhoto);
router
  .route("/:id")
  .get(protect, getPhotoDetail)
  .post(protect, toggleLikePhoto)
  .delete(protect, deletePhoto);

router.route(
  "/images",
  express.static(path.join(__dirname, "public", "images"))
);
module.exports = router;
