const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createUser = async (userData) => {
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ username: userData.username }, { email: userData.email }],
    },
  });
  if (existingUser) {
    // Check which field is duplicated and throw the appropriate error
    if (existingUser.username === userData.username) {
      throw new AppError("Хэрэглэгчийн нэр аль хэдийн авсан байна", 409);
    }
    if (existingUser.email === userData.email) {
      throw new AppError("И-мэйл аль хэдийн авсан байна", 409);
    }
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await db.user.create({
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: hashedPassword,
    },
  });
  if (user) return user;
  throw new AppError(`Хэрэглэгч үүссэнгүй!`, 500);
};
exports.loginWithCredentials = async (userData) => {
  console.log(userData);
  const normalizedIdentifier = userData.identifier.toLowerCase();
  console.log("id", normalizedIdentifier);
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
    },
  });
  const aa = await db.user.findFirst({
    where: {
      email: normalizedIdentifier,
    },
  });
  console.log(existingUser, aa);
  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  const passwordMatch = await bcrypt.compare(
    userData.password,
    existingUser.password
  );
  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        username: existingUser.username,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        image: existingUser.image,
        email_verified: existingUser.emailVerified,
      },
      process.env.AUTH_SECRET,
      { expiresIn: "10day" }
    );
    existingUser.accessToken = token;
    delete existingUser.password;
    return existingUser;
  } else {
    throw new AppError("Нууц үг буруу байна", 401);
  }
};
exports.changePassword = async (userId, userData) => {
  const existingUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  const passwordMatch = await bcrypt.compare(
    userData.oldPassword,
    existingUser.password
  );
  if (passwordMatch) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return true;
  } else {
    throw new AppError("Буруу нууц үг", 401);
  }
};
exports.changeUserRole = async (userId, userData) => {
  if (!userData.role || !userData.identifier)
    throw new AppError("Хэрэглэгч эсвэл эрхийн түвшин оруулна уу", 400);

  const normalizedIdentifier = userData.identifier.toLowerCase();
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }

  const user = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      role: userData.role,
    },
  });
  delete user.password;
  return user;
};
exports.deleteUser = async (userId, userData) => {
  if (!userData.identifier) throw new AppError("Хэрэглэгч оруулна уу", 400);

  const normalizedIdentifier = userData.identifier.toLowerCase();
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  if (existingUser.id === userId) {
    throw new AppError("Өөр өөрийгөө устгаж болохгүй", 401);
  }

  const user = await db.user.delete({
    where: {
      id: existingUser.id,
    },
  });
  return user;
};

//PAGINATION BY SINGLE ID
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
