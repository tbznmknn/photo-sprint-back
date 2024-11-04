const express = require("express");
const {
  loginUser,
  logoutUser,
  // createUser,
  // loginWithCredentials,
  // changePassword,
  // changeUserRole,
  // deleteUser,
  // getUsers,
  // getUserDetailByAdmin,
  // getUserDetailBySameUser,
  // editUserDetailsBySameUser,
} = require("../controllers/adminController");
const {
  loginSchema,
  // createUserSchema,
  // changePasswordSchema,
  // editUserDetailsSchema,
} = require("../schemas/userSchema"); // Import the Zod schema
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();
const passport = require("passport");
require("../strategies/google-strategy");
require("../strategies/facebook-strategy");

//ROUTES
// router.route("/register").post(validateRequest(createUserSchema), createUser); //Хэрэглэгч бүртгүүлнэ
router.route("/login").post(validateRequest(loginSchema), loginUser); //Хэрэглэгч нэвтэрнэ
router.route("/logout").post(validateRequest(loginSchema), logoutUser); //Хэрэглэгч нэвтэрнэ
// router
//   .route("/changepassword")
//   .put(protect, validateRequest(changePasswordSchema), changePassword); //Пассворд солих. Нэвтэрсэн байх шаардлагатай
// router
//   .route("/role")
//   .put(protect, authorize("ADMIN", "SUPERADMIN"), changeUserRole); // Хэрэглэгчийн эрх солих. Суперадмин нь л хийж болно. Өөрийгөө өөрчилж болохгүй
// router
//   .route("/deleteuser")
//   .delete(protect, authorize("SUPERADMIN"), deleteUser); // Хэрэглэгчийн эрх солих. Суперадмин нь л хийж болно. Өөрийнхөө эрхээ өөрчилж болохгүй

//* OAUTH ROUTES
// router
//   .route("/google")
//   .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// router.route("/google/callback").get(
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: `${process.env.FRONTEND_URL}/account/login`,
//   }),
//   (req, res) => {
//     res.cookie("auth_token", req.user.user.accessToken, {
//       httpOnly: true, // Cookie not accessible by JS
//       secure: true, // Only sent over HTTPS
//       sameSite: "Strict", // Prevent cross-site requests
//       maxAge: 3600000, // Expire after 1 hour
//     });
//     res.redirect(`${process.env.FRONTEND_URL}/api/auth/oauth`);
//   }
// );
// router
//   .route("/facebook")
//   .get(passport.authenticate("facebook", { scope: ["profile", "email"] }));

// router.route("/facebook/callback").get(
//   passport.authenticate("facebook", {
//     session: false,
//     failureRedirect: `${process.env.FRONTEND_URL}/account/login`,
//   }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect(`${process.env.FRONTEND_URL}/api/auth/oauth`);
//   }
// );

module.exports = router;
