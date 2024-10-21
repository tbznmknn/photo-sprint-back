const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createVendor = async (userData) => {
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
  const existingVendor = await db.vendor.findUnique({
    where: {
      businessEmail: userData.businessEmail,
    },
  });
  if (existingVendor) {
    throw new AppError("Бизнесийн и-мэйл ашиглагдсан байна", 409);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const vendor = await db.user.create({
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: hashedPassword,
      role: "VENDOR",
      vendor: {
        create: {
          businessAddress: userData.businessAddress,
          businessEmail: userData.businessEmail,
          businessName: userData.businessName,
          contactNumber: userData.contactNumber,
          commissionRate: userData.commissionRate,
        },
      },
    },
  });
  if (vendor) return vendor;
  throw new AppError(`Вендор үүсгэгдсэнгүй!`, 500);
};

exports.deleteUser = async (userId, userData) => {
  if (!userData.identifier) throw new AppError("Enter user", 400);

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
    throw new AppError("You cannot delete yourself", 401);
  }

  const user = await db.user.delete({
    where: {
      id: existingUser.id,
    },
  });
  return user;
};

exports.getVendors = async (userId, queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || ""; // Single search query for all columns

  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";
  const filters = {
    OR: [
      { businessName: { contains: searchQuery } },
      { businessEmail: { contains: searchQuery } },
      { contactNumber: { contains: searchQuery } },
    ],
  };

  try {
    const vendors = await db.vendor.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: {
        [sortField]: sortOrder,
      },
      select: {
        id: true,
        businessName: true,
        businessEmail: true,
        contactNumber: true,
      },
    });

    const total = await db.vendor.count({
      where: filters,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      vendors,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (errors) {
    throw new AppError(errors);
  }
};
exports.getVendorDetail = async (vendorId) => {
  if (!vendorId) throw new AppError("ID оруулна уу", 400);

  const existingVendor = await db.vendor.findUnique({
    where: {
      id: vendorId,
    },
    include: {
      user: true,
    },
  });

  if (!existingVendor) {
    throw new AppError("Вендор олдсонгүй", 409);
  }
  // delete existingVendor.password;
  return existingVendor;
};
exports.editUserDetails = async (vendorId, userData) => {
  if (!vendorId) throw new AppError("ID оруулна уу", 400);
  const { firstName, lastName, username, password } = userData;

  const existingUser = await db.user.findUnique({
    where: {
      id: vendorId,
    },
  });
  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  const existingUsername = await db.user.findUnique({
    where: {
      username: username,
    },
  });
  if (existingUsername) {
    throw new AppError("Username is taken", 400);
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) throw new AppError("Incorrect password", 401);
  const changedUser = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
    },
  });
  delete changedUser.password;
  return changedUser;
};
exports.getVendorIdByUserId = async (userId) => {
  if (!userId) throw new AppError("ID оруулна уу", 403);
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      vendor: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!user.vendor) throw new AppError("Вендор олдсонгүй", 409);

  return user.vendor.id;
};
exports.editVendorDetail = async (vendorId, userData) => {
  if (!vendorId) throw new AppError("Vendor-ийн ID оруулна уу", 400);
  const { businessName, businessEmail, contactNumber, businessAddress } =
    userData;

  const existingVendor = await db.user.findUnique({
    where: {
      id: vendorId,
    },
  });
  if (!existingVendor) {
    throw new AppError("Вендор олдсонгүй", 409);
  }
  const existingVendorEmail = await db.vendor.findUnique({
    where: {
      businessEmail: businessEmail,
    },
  });

  if (
    existingVendorEmail &&
    businessEmail !== existingVendorEmail.businessEmail
  ) {
    throw new AppError("Бизнесийн и-мэйл аль хэдийн авсан байна", 400);
  }
  const changedVendor = await db.vendor.update({
    where: {
      id: existingVendor.id,
    },
    data: {
      businessName: businessName || undefined,
      businessEmail: businessEmail || undefined,
      contactNumber: contactNumber || undefined,
      businessAddress: businessAddress || undefined,
    },
  });
  return changedVendor;
};
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
