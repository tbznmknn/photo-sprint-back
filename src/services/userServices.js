const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const { cs142models } = require("../../modelData/photoApp");
const User = require("../models/user");
const SchemaInfo = require("../models/schemaInfo");
const Photo = require("../models/photo");
const mongoose = require("mongoose");
const { identity } = require("lodash");
const { createLogger } = require("winston");
const Activity = require("../models/activity");
exports.getUsers5 = async () => {
  const users = cs142models.userListModel();
  return users;
};
exports.getDetails5 = async (id) => {
  const user = cs142models.userModel(id);
  return user;
};
exports.getPhotos5 = async (id) => {
  const photos = cs142models.photoOfUserModel(id);
  return photos;
};

exports.getTest = async () => {
  const users = cs142models.userListModel();
  return users;
};
exports.getUserComments = async (userId) => {
  try {
    const photos = await Photo.find({ "comments.user_id": userId }).exec();
    const userComments = photos.flatMap((photo) =>
      photo.comments
        .filter(
          (comment) => comment.user_id && comment.user_id.toString() === userId
        )
        .map((comment) => ({
          file_name: photo.file_name,
          comment: comment.comment,
          date_time: comment.date_time,
          id: photo.id,
        }))
    );

    return userComments;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error;
  }
};

exports.getUserList = async (id) => {
  const userList = await User.aggregate([
    {
      $lookup: {
        from: "photos",
        localField: "_id",
        foreignField: "user_id",
        as: "photos",
      },
    },
    {
      $addFields: {
        numPhotos: { $size: "$photos" },
        numComments: {
          $sum: {
            $map: {
              input: "$photos",
              as: "photo",
              in: {
                $size: {
                  $filter: {
                    input: "$$photo.comments",
                    as: "comment",
                    cond: { $eq: ["$$comment.user_id", "$_id"] },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        first_name: 1,
        last_name: 1,
        location: 1,
        description: 1,
        occupation: 1,
        login_name: 1,
        numPhotos: 1,
        numComments: 1,
      },
    },
  ]);

  return userList;
};
exports.getUserDetail = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Формат буруу байнай", 400);
  }
  const monData = await User.findOne({ _id: id });
  if (!monData) {
    console.log("Error");
    throw new AppError("Хэрэглэгч олдсонгүй", 400);
  }
  return monData;
};
exports.getUserPhoto = async (id) => {
  console.log("asdfasfad");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Формат буруу байнай", 400);
  }
  const monData = await Photo.find({ user_id: id }).populate({
    path: "user_id",
    select: "_id first_name last_name", // Specify the fields you want to include
  });

  if (!monData || monData.length === 0) {
    return [];
    console.log("Error");
    throw new AppError("Хэрэглэгч олдсонгүй", 400);
  }
  console.log("asdfasfad");

  return monData;
};
// exports.getUsers = async (userId, queries) => {
//   const page = parseInt(queries.page) || 1;
//   const limit = parseInt(queries.limit) || 10;
//   const skip = (page - 1) * limit;

//   const searchQuery = queries.search || ""; // Single search query for all columns

//   const sortField = queries.sortField || "createdAt";
//   const sortOrder = queries.sortOrder || "desc";

//   const filters = {
//     OR: [
//       { email: { contains: searchQuery } },
//       { username: { contains: searchQuery } },
//       { telephone: { contains: searchQuery } },
//       { firstName: { contains: searchQuery } },
//       { lastName: { contains: searchQuery } },
//     ],
//   };

//   try {
//     const users = await db.user.findMany({
//       skip,
//       take: limit,
//       where: filters,
//       orderBy: {
//         [sortField]: sortOrder,
//       },
//       select: {
//         id: true,
//         email: true,
//         emailVerified: true,
//         username: true,
//         createdAt: true,
//         modifiedAt: true,
//         firstName: true,
//         lastName: true,
//         telephone: true,
//         role: true,
//       },
//     });

//     const total = await db.user.count({
//       where: filters,
//     });

//     const totalPages = Math.ceil(total / limit);
//     return {
//       users,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         limit,
//       },
//     };
//   } catch (errors) {
//     throw new AppError(errors);
//   }
// };
// exports.getUserDetail = async (userId) => {
//   if (!userId) throw new AppError("Хэрэглэгчийн ID оруулна уу", 400);

//   const existingUser = await db.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!existingUser) {
//     throw new AppError("Хэрэглэгч олдсонгүй", 409);
//   }
//   delete existingUser.password;
//   return existingUser;
// };
// exports.editUserDetails = async (userId, userData) => {
//   if (!userId) throw new AppError("Хэрэглэгийн ID оруулна уу", 400);
//   const { firstName, lastName, username, password } = userData;

//   const existingUser = await db.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   if (!existingUser) {
//     throw new AppError("Хэрэглэгч олдсонгүй", 409);
//   }
//   const existingUsername = await db.user.findUnique({
//     where: {
//       username: username,
//     },
//   });
//   if (existingUsername) {
//     throw new AppError("Хэрэглэгчийн нэр аль хэдийн авсан байна", 400);
//   }
//   const passwordMatch = await bcrypt.compare(password, existingUser.password);
//   if (!passwordMatch) throw new AppError("Буруу нууц үг", 401);
//   const changedUser = await db.user.update({
//     where: {
//       id: existingUser.id,
//     },
//     data: {
//       firstName: firstName || undefined,
//       lastName: lastName || undefined,
//       username: username || undefined,
//     },
//   });
//   delete changedUser.password;
//   return changedUser;
// };

//OR HAILT
// exports.getUsers = async (req, res) => {
//   const page = parseInt(queries.page) || 1;
//   const limit = parseInt(queries.limit) || 10;
//   const skip = (page - 1) * limit;
//   // const search = queries.search || "";
//   const email = queries.email || "";
//   const phone = queries.phone_number || "";
//   const companyName = queries.company_name || "";
//   const useServerQuery = queries.useServer || "";

//   const useServer = useServerQuery == "true";

//   const sortField = queries.sortField || "createdAt";
//   const sortOrder = queries.sortOrder || "desc";
//   const filters = {
//     AND: [
//       companyName ? { company_name: { contains: companyName } } : {},
//       email ? { email: { contains: email } } : {},

//       phone ? { phone_number: { contains: phone } } : {},
//       useServerQuery ? { useServer: useServer } : {},
//       { hudaldan_avagch: null },
//       { role: "USER" },
//       { registeredBy: null },
//       // useServer ? { useServer: false } : {},
//     ],
//   };
//   try {
//     const users = await prisma.user.findMany({
//       skip,
//       take: limit,
//       // where: filters,

//       orderBy: {
//         [sortField]: sortOrder,
//       },
//       // include: {
//       //   hudaldan_avagch: {
//       //     select: { info_check: true },
//       //   },
//       // },
//       select: {
//         id: true,
//         email: true,
//         emailVerified: true,
//         role: true,
//         company_name: true,
//         phone_number: true,
//       },
//     });

//     const total = await prisma.user.count({
//       where: filters,
//     });

//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       data: users,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         limit,
//       },
//     });
//   } catch (errors) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
