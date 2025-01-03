const catchAsync = require("../utils/catchAsync");
const photosServices = require("../services/photosServices");
const Activity = require("../models/activity");
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
  const { photo_id } = req.params;
  console.log("aaaa");
  const photoComment = await photosServices.addPhotoComment(
    photo_id,
    req.userId,
    req.body
  );

  return res.status(200).json({
    success: true,
    data: photoComment,
    message: "Амжилттай авлаа",
  });
});
exports.addPhoto = catchAsync(async (req, res, next) => {
  const photo = await photosServices.addPhoto(req.file, req.userId);
  return res.status(200).json({
    success: true,
    data: photo,
    message: "Амжилттай авлаа",
  });
});
exports.getPhotoDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const photo = await photosServices.getPhotoDetail(id);
  return res.status(200).json({
    success: true,
    data: photo,
    message: "Амжилттай авлаа",
  });
});
exports.toggleLikePhoto = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const photo = await photosServices.toggleLikePhoto(id, req.userId);

  return res.status(200).json({
    success: true,
    data: photo,
    message: "Амжилттай",
  });
});
exports.deletePhoto = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const photo = await photosServices.deletePhoto(id, req.userId);

  return res.status(200).json({
    success: true,
    data: photo,
    message: "Амжилттай",
  });
});
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment_id } = req.params;
  const photo = await photosServices.deleteComment(comment_id, req.userId);

  return res.status(200).json({
    success: true,
    data: photo,
    message: "Амжилттай",
  });
});
