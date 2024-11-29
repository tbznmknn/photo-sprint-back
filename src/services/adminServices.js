const AppError = require("../utils/AppError");
const User = require("../models/user");
const {
  doesPasswordMatch,
  makePasswordEntry,
} = require("../utils/cs142password");
const jwt = require("jsonwebtoken");
const Activity = require("../models/activity");
exports.loginUser = async (userData, session) => {
  const { login_name, password } = userData;
  const user = await User.findOne({ login_name });
  if (!user) {
    throw new AppError("Хэрэглэгч олдсонгүй", 400);
  }
  const { password_digest, salt } = user;
  const isMatch = doesPasswordMatch(password_digest, salt, password);
  if (!isMatch) {
    throw new AppError("Нууц үг буруу байна", 400);
  }
  const token = jwt.sign(
    {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name,
    },
    process.env.AUTH_SECRET,
    { expiresIn: "30day" }
  );
  session.userId = user._id;
  session.firstName = user.first_name;
  console.log(session.userId);
  await Activity.create({
    type: "User Login",
    user: user._id,
  });
  return {
    token: token,
    userId: user._id,
    firstName: user.first_name,
  };
};
exports.logoutUser = (session) => {
  console.log(session);
  if (!session.userId) {
    throw new AppError("User is not logged in", 400);
  }

  session.destroy((err) => {
    if (err) {
      throw new AppError("Failed to log out", 500);
    }
  });
};
exports.registerUser = async (userData) => {
  const {
    login_name,
    first_name,
    last_name,
    password,
    occupation,
    description,
    location,
  } = userData;

  // Check if login_name is already taken
  const existingUser = await User.findOne({ login_name });
  if (existingUser) {
    throw new AppError("Login name already exists", 400);
  }

  // Generate the salted and hashed password
  const { salt, hash: password_digest } = makePasswordEntry(password);

  // Create and save the user
  const newUser = await User.create({
    login_name,
    first_name,
    last_name,
    password_digest,
    salt,
    occupation,
    description,
    location,
  });
  await Activity.create({
    type: "User Register",
    user: newUser._id,
  });
  return newUser;
};
exports.get5Activites = async () => {
  try {
    const activities = await Activity.find()
      .sort({ date_time: -1 })
      .limit(5)
      .populate("user", "first_name last_name") // Populate user details
      .populate("photo", "file_name"); // Populate photo details if applicable
    return activities;
  } catch (error) {
    console.error(error);
    throw new AppError("Fetch error", 500);
  }
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
