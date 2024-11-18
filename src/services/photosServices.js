const AppError = require("../utils/AppError");
const Photo = require("../models/photo");
const mongoose = require("mongoose");
exports.getUserPhoto = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Формат буруу байнай", 400);
  }
  const monData = await Photo.find({ user_id: id }).populate({
    path: "user_id",
    select: "_id first_name last_name",
  });

  if (!monData || monData.length === 0) {
    console.log("Error");
    throw new AppError("Хэрэглэгч олдсонгүй", 400);
  }
  return monData;
};
exports.getPhotoComments = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Формат буруу байна", 400);
  }
  const monData = await Photo.find({ user_id: id }).populate({
    path: "user_id",
    select: "_id first_name last_name",
  });

  if (!monData || monData.length === 0) {
    console.log("Error");
    throw new AppError("Хэрэглэгч олдсонгүй", 400);
  }
  return monData;
};
exports.addPhotoComment = async (photoId, userId, photoDetail) => {
  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new AppError("Формат буруу байна", 400);
  }

  const { comment } = photoDetail;
  console.log("aaaa", comment, userId);

  if (!comment) {
    throw new AppError("Коммент оруулна уу", 400);
  }
  const photo = await Photo.findById(photoId);

  if (!photo) {
    throw new AppError("Зураг олдсонгүй", 400);
  }
  const newComment = await Photo.findByIdAndUpdate(
    photoId,
    {
      $push: {
        comments: {
          comment,
          user_id: userId,
        },
      },
    },
    { new: true }
  );
  return newComment;
};

exports.addPhoto = async (file, userId) => {
  if (!file) {
    throw new AppError("5MB-ээс доош зураг оруулна уу", 400);
  }

  console.log(file.filename);
  if (!file.filename) throw new AppError("Зурагны зам буруу", 400);

  const photo = await Photo.create({
    file_name: file.filename,
    user_id: userId,
  });

  return photo;
};
exports.getPhotoDetail = async (photoId) => {
  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new AppError("Формат буруу байна", 400);
  }
  const photo = await Photo.findById(photoId);
  if (!photo) {
    throw new AppError("Зураг олдсонгүй", 400);
  }
  return photo;
};
