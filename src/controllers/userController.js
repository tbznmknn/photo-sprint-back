const catchAsync = require("../utils/catchAsync");
const userServices = require("../services/userServices");

const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
exports.getList5 = catchAsync(async (req, res, next) => {
  console.log("called");
  const users = await userServices.getUsers5();
  console.log(users);
  // return res.status(200).json({
  //   success: true,
  //   data: users,
  //   message: "Амжилттай авлаа",
  // });
  return res.status(200).json(users);
});
exports.getDetail5 = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await userServices.getDetails5(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getPhotos5 = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const users = await userServices.getPhotos5(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getTest = catchAsync(async (req, res, next) => {
  const users = await userServices.getTest();
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getUserList = catchAsync(async (req, res, next) => {
  const users = await userServices.getUserList();

  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getUserDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await userServices.getUserDetail(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getUserComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await userServices.getUserComments(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
exports.getUserPhoto = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const users = await userServices.getUserPhoto(id);
  return res.status(200).json({
    success: true,
    data: users,
    message: "Амжилттай авлаа",
  });
});
// exports.getUsers = catchAsync(async (req, res, next) => {
//   const { users, pagination } = await userServices.getUsers(
//     req.userId,
//     req.query
//   );
//   return res.status(200).json({
//     success: true,
//     data: users,
//     pagination,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.getUserDetailByAdmin = catchAsync(async (req, res, next) => {
//   const user = await userServices.getUserDetail(parseInt(req.params.id));
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.getUserDetailBySameUser = catchAsync(async (req, res, next) => {
//   const user = await userServices.getUserDetail(req.userId);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.editUserDetailsBySameUser = catchAsync(async (req, res, next) => {
//   const user = await userServices.editUserDetails(req.userId, req.body);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай хэрэглэгчийн мэдээлэл шинэчлэгдлээ",
//   });
// });
