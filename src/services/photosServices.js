const AppError = require("../utils/AppError");
const Photo = require("../models/photo");
const mongoose = require("mongoose");
const Activity = require("../models/activity");
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
  await Activity.create({
    type: "New Comment",
    user: userId,
    photo: photoId,
  });
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
  await Activity.create({
    type: "Photo Upload",
    user: userId,
    photo: photo._id,
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
exports.toggleLikePhoto = async (photoId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new AppError("Формат буруу байна", 400);
  }

  const photo = await Photo.findById(photoId);

  if (!photo) {
    throw new AppError("Зураг олдсонгүй", 400);
  }

  let action = "";

  if (photo.likes && photo.likes.includes(userId)) {
    // Unlike now.
    await Photo.findByIdAndUpdate(
      photoId,
      { $pull: { likes: userId } },
      { new: true }
    );
    action = "Unlike";

    await Activity.create({
      type: "Photo Unlike",
      user: userId,
      photo: photoId,
    });
  } else {
    // Like it now.
    await Photo.findByIdAndUpdate(
      photoId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    action = "Like";
    await Activity.create({
      type: "Photo Like",
      user: userId,
      photo: photoId,
    });
  }

  const updatedPhoto = await Photo.findById(photoId).select("likes");
  return { likes: updatedPhoto.likes.length, action };
};
exports.deletePhoto = async (photoId, userId) => {
  const photo = await Photo.findOne({ _id: photoId, user_id: userId });

  if (!photo) {
    throw new AppError("Та энэ зургийг устгаж чадахгүй", 400); // "You cannot delete this photo"
  }

  await Photo.findByIdAndDelete(photoId);
  await Activity.deleteMany({ photo: photoId });

  return { message: "Зураг амжилттай устгагдлаа", photoId }; // "Photo deleted successfully"
};
exports.deleteComment = async (commentId, userId) => {
  const photo = await Photo.findOne({
    "comments._id": commentId,
    "comments.user_id": userId,
  });

  if (!photo) {
    throw new AppError("Та энэ сэтгэгдлийг устгаж чадахгүй", 400);
  }

  // Remove the comment from the comments array
  photo.comments = photo.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );

  await photo.save();

  // await Activity.deleteMany({ comment: commentId });

  return { message: "Сэтгэгдэл амжилттай устгагдлаа", commentId }; // "Comment deleted successfully"
};
