const catchAsync = require("../utils/catchAsync");
const photosServices = require("../services/photosServices");

const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");

exports.getUserPhoto = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await photosServices.getUserPhoto(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
