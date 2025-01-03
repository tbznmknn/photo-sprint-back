const express = require("express");
const {
  getUserList,
  getUserDetail,
  getUserPhoto,
  getTest,
  getUserComments,
  deleteUserAccount,
} = require("../controllers/userController");
const { registerUser } = require("../controllers/adminController");
const { editUserDetailsSchema } = require("../schemas/userSchema"); // Import the Zod schema
const { registerSchema } = require("../schemas/userSchema"); // Import the Zod schema
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();
// router.route("/register").post(validateRequest(createUserSchema), createUser);

router
  .route("/")
  .post(validateRequest(registerSchema), registerUser)
  .delete(protect, deleteUserAccount);
router.route("/test").get(protect, getTest);
router.route("/list").get(protect, getUserList);
router.route("/comments/:id").get(protect, getUserComments);
router.route("/:id").get(protect, getUserDetail);
router.route("/photosOfUser/:id").get(protect, getUserPhoto);
// router.route("/list").get(getList5);
// router.route("/:id").get(getDetail5);
// router.route("/photosOfUser/:id").get(getPhotos5);
// router
//   .route("/getusers")
//   .get(protect, authorize("ADMIN", "SUPERADMIN"), getUsers); // Хэрэглэгчийн эрх солих. Админ нь л хийж болно. Өөрийнхөө эрхээ өөрчилж болохгүй
// router
//   .route("/getuserdetail/:id")
//   .get(protect, authorize("ADMIN", "SUPERADMIN"), getUserDetailByAdmin); // Админаар хэрэглэгчийн мэдээлэл харна.
// router.route("/getuserdetail").get(protect, getUserDetailBySameUser); // Өөрийнхөө хэрэглэгчийн мэдээлэл харна
// router
//   .route("/edituserdetail")
//   .put(
//     protect,
//     validateRequest(editUserDetailsSchema),
//     editUserDetailsBySameUser
//   ); // Өөрийнхөө USER мэдээллээ засна. !!! input validation saijruulah heregtei !!!

module.exports = router;
