const express = require("express");
const {
  addPhotoComment,
  deleteComment,
} = require("../controllers/photosController");

const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();

router.route("/:photo_id").post(protect, addPhotoComment);
router.route("/:comment_id").delete(protect, deleteComment);

module.exports = router;
