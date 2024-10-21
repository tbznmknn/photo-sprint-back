const catchAsync = require("../utils/catchAsync");
const userService = require("../services/authServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.test = catchAsync(async (req, res, next) => {
  logger.error("hiii");

  res.status(200).json({ success: true, message: "test" });
  // logger.error({
  //   message: err.message,
  //   statusCode,
  //   stack: err.stack,
  // });
  // await new Promise((resolve) => setTimeout(resolve, 10000000));
  // // next(new AppError(`Can't find on this server!`, 404));
  // // return res.status(200).json({ success: true, message: "test" });
  // // next();
  // try {
  //   // throw new AppError(`Худалдан авагч олдсонгүй!`, 404);
  // } catch (e) {
  //   next(e);
  //   // throw new AppError();
  // }
  // throw new AppError(`Can't find on this server!`, 404);
  // return next(
  //   new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  // );
  // return res.status(200).json({ success: true, message: "test" });
});
