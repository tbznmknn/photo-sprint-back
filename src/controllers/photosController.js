const catchAsync = require("../utils/catchAsync");
const photosServices = require("../services/photosServices");

const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");

exports.getPhotoComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await photosServices.getPhotoComments(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.addPhotoComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // const userId = req.sessions.
  console.log(id);
  console.log("session", req.session);
  return res.status(200).json({
    message: "Амжилттай авлаа",
  });
  const users = await photosServices.addPhotoComment(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
