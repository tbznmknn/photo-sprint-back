const catchAsync = require("../utils/catchAsync");
const adminServices = require("../services/adminServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
const { createLogger } = require("winston");
exports.loginUser = catchAsync(async (req, res, next) => {
  console.log("cookie", req.session);
  const user = await adminServices.loginUser(req.body, req.session);
  return res.status(200).json({
    success: true,
    data: user,
  });
});
exports.logoutUser = catchAsync(async (req, res, next) => {
  await adminServices.logoutUser(req.session);
  return res.status(200).json({
    success: true,
  });
});

exports.registerUser = catchAsync(async (req, res, next) => {
  const user = await adminServices.registerUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});
exports.get5Activites = catchAsync(async (req, res, next) => {
  const activity = await adminServices.get5Activites();
  res.status(200).json({
    success: true,
    data: activity,
  });
});
// exports.loginWithCredentials = catchAsync(async (req, res, next) => {
//   const user = await adminServices.loginWithCredentials(req.body);
//   return res.status(200).json({
//     success: true,
//     data: user,
//   });
// });

// exports.changePassword = catchAsync(async (req, res, next) => {
//   const user = await adminServices.changePassword(req.userId, req.body);
//   return res.status(200).json({
//     success: true,
//     message: "Нууц үг амжилттай солигдлоо",
//   });
// });
// exports.changeUserRole = catchAsync(async (req, res, next) => {
//   const user = await adminServices.changeUserRole(req.userId, req.body);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Хэрэглэгчийн эрх амжилттай солигдлоо",
//   });
// });
// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const user = await adminServices.deleteUser(req.userId, req.body);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Хэрэглэгч амжилттай устгагдлаа",
//   });
// });
