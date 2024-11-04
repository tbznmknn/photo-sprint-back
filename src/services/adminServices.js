const AppError = require("../utils/AppError");
// const bcrypt = require("bcrypt");
const User = require("../models/user");
// const jwt = require("jsonwebtoken");

exports.loginUser = async (userData, session) => {
  const { login_name } = userData;
  const user = await User.findOne({ login_name });
  console.log("user", user, login_name);
  if (!user) {
    throw new AppError("Invalid login credentials", 400);
  }
  session.userId = user._id;
  session.firstName = user.first_name;
  return {
    userId: user._id,
    firstName: user.first_name,
  };
};
exports.logoutUser = (session) => {
  if (!session.userId) {
    throw new AppError("User is not logged in", 400);
  }

  session.destroy((err) => {
    if (err) {
      throw new AppError("Failed to log out", 500);
    }
  });
};

//OTHERS
exports.createUser = async (userData) => {
  // const existingUser = await db.user.findFirst({
  //   where: {
  //     OR: [{ username: userData.username }, { email: userData.email }],
  //   },
  // });
  // if (existingUser) {
  //   // Check which field is duplicated and throw the appropriate error
  //   if (existingUser.username === userData.username) {
  //     throw new AppError("Хэрэглэгчийн нэр аль хэдийн авсан байна", 409);
  //   }
  //   if (existingUser.email === userData.email) {
  //     throw new AppError("И-мэйл аль хэдийн авсан байна", 409);
  //   }
  // }
  // const hashedPassword = await bcrypt.hash(userData.password, 10);
  // const user = await db.user.create({
  //   data: {
  //     email: userData.email,
  //     firstName: userData.firstName,
  //     lastName: userData.lastName,
  //     username: userData.username,
  //     password: hashedPassword,
  //   },
  // });
  // if (user) return user;
  // throw new AppError(`Хэрэглэгч үүссэнгүй!`, 500);
};
exports.loginWithCredentials = async (userData) => {
  // console.log(userData);
  // const normalizedIdentifier = userData.identifier.toLowerCase();
  // console.log("id", normalizedIdentifier);
  // const existingUser = await db.user.findFirst({
  //   where: {
  //     OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  //   },
  // });
  // const aa = await db.user.findFirst({
  //   where: {
  //     email: normalizedIdentifier,
  //   },
  // });
  // console.log(existingUser, aa);
  // if (!existingUser) {
  //   throw new AppError("Хэрэглэгч олдсонгүй", 409);
  // }
  // const passwordMatch = await bcrypt.compare(
  //   userData.password,
  //   existingUser.password
  // );
  // if (passwordMatch) {
  //   const token = jwt.sign(
  //     {
  //       id: existingUser.id,
  //       email: existingUser.email,
  //       role: existingUser.role,
  //       username: existingUser.username,
  //       firstName: existingUser.firstName,
  //       lastName: existingUser.lastName,
  //       image: existingUser.image,
  //       email_verified: existingUser.emailVerified,
  //     },
  //     process.env.AUTH_SECRET,
  //     { expiresIn: "10day" }
  //   );
  //   existingUser.accessToken = token;
  //   delete existingUser.password;
  //   return existingUser;
  // } else {
  //   throw new AppError("Нууц үг буруу байна", 401);
  // }
};
exports.changePassword = async (userId, userData) => {
  // const existingUser = await db.user.findFirst({
  //   where: {
  //     id: userId,
  //   },
  // });
  // if (!existingUser) {
  //   throw new AppError("Хэрэглэгч олдсонгүй", 409);
  // }
  // const passwordMatch = await bcrypt.compare(
  //   userData.oldPassword,
  //   existingUser.password
  // );
  // if (passwordMatch) {
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   await db.user.update({
  //     where: {
  //       id: existingUser.id,
  //     },
  //     data: {
  //       password: hashedPassword,
  //     },
  //   });
  //   return true;
  // } else {
  //   throw new AppError("Буруу нууц үг", 401);
  // }
};
exports.changeUserRole = async (userId, userData) => {
  // if (!userData.role || !userData.identifier)
  //   throw new AppError("Хэрэглэгч эсвэл эрхийн түвшин оруулна уу", 400);
  // const normalizedIdentifier = userData.identifier.toLowerCase();
  // const existingUser = await db.user.findFirst({
  //   where: {
  //     OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  //   },
  // });
  // if (!existingUser) {
  //   throw new AppError("Хэрэглэгч олдсонгүй", 409);
  // }
  // const user = await db.user.update({
  //   where: {
  //     id: existingUser.id,
  //   },
  //   data: {
  //     role: userData.role,
  //   },
  // });
  // delete user.password;
  // return user;
};
exports.deleteUser = async (userId, userData) => {
  // if (!userData.identifier) throw new AppError("Хэрэглэгч оруулна уу", 400);
  // const normalizedIdentifier = userData.identifier.toLowerCase();
  // const existingUser = await db.user.findFirst({
  //   where: {
  //     OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  //   },
  // });
  // if (!existingUser) {
  //   throw new AppError("Хэрэглэгч олдсонгүй", 409);
  // }
  // if (existingUser.id === userId) {
  //   throw new AppError("Өөр өөрийгөө устгаж болохгүй", 401);
  // }
  // const user = await db.user.delete({
  //   where: {
  //     id: existingUser.id,
  //   },
  // });
  // return user;
};
