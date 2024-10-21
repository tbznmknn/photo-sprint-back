const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");

exports.createOrder = async (product, images) => {
  //Formdata хүсэлтээр илгээгдэнэ
  //Зураг заавал илгээгдсэн гэж үзнэ

  // Convert flashSaleEndDate to ISO 8601 format if it exists
  const flashSaleEndDate = product.flashSaleEndDate
    ? new Date(product.flashSaleEndDate).toISOString()
    : null;

  const createdProduct = await db.product.create({
    data: {
      name: product.name || "Unnamed Product", // Provide default if name is missing
      description: product.description || "", // Default to empty string if description is missing
      price: parseFloat(product.price),
      vendorId: parseInt(product.vendorId),
      discountId: product.discountId ? parseInt(product.discountId) : null, // Optional field
      promotionId: product.promotionId ? parseInt(product.promotionId) : null, // Optional field
      categoryId: product.categoryId ? parseInt(product.categoryId) : null, // Optional field
      sku: product.sku,
      flashSale: product.flashSale === "true" || false,
      flashSaleEndDate, // Include only if it exists, otherwise null
      inventory: {
        create: {
          quantity: parseInt(product.quantity),
        },
      },
      ProductImages: {
        create: images.map((image) => ({
          imageUrl: image.imageUrl, // No default, since this is required for an image
          altText: image.altText || "", // Default to empty string if altText is missing
          isPrimary: image.isPrimary || false, // Default to false if isPrimary is missing
        })),
      },
    },
    include: {
      ProductImages: true, // Include images in the response
      inventory: true,
    },
  });

  if (createdProduct) return createdProduct;
  throw new AppError(`Бүтээгдэхүүн бүртгэгдсэнгүй!`, 500);
};

exports.getProducts = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";

  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";
  const vendorId = queries.vendorId || "";
  const categoryId = queries.categoryId || "";
  const minPrice = queries.minPrice || "";
  const maxPrice = queries.maxPrice || "";

  //   const filters = {
  //     OR: [
  //       { email: { contains: searchQuery } },
  //       { username: { contains: searchQuery } },
  //       { telephone: { contains: searchQuery } },
  //       { firstName: { contains: searchQuery } },
  //       { lastName: { contains: searchQuery } },
  //     ],
  //   };

  try {
    const products = await db.product.findMany({
      skip,
      take: limit,
      //   where: filters,
      orderBy: {
        [sortField]: sortOrder,
      },
      where: {
        vendorId: vendorId ? parseInt(vendorId) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        price: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        sku: true,
        ProductImages: {
          take: 1,
          select: {
            imageUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },

        vendor: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    const total = await db.product.count({
      //   where: filters,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      products,
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
exports.getProductDetails = async (productId) => {
  if (!productId) throw new AppError("Enter product id", 400);

  const existingProduct = await db.product.findUnique({
    where: {
      id: parseInt(productId),
    },
    include: {
      ProductImages: true,
      inventory: {
        select: {
          quantity: true,
        },
      },
    },
  });

  if (!existingProduct) {
    throw new AppError("Бүтээгдэхүүн олдсонгүй", 409);
  }
  return existingProduct;
};
exports.updateProduct = async (productId, productDetail) => {
  const existingProduct = await db.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
  if (!existingProduct) throw new AppError("Бүтээгдэхүүн байхгүй байна", 409);
  const updateProduct = await db.product.update({
    where: {
      id: parseInt(productId),
    },
    include: {
      inventory: {
        select: {
          quantity: true,
        },
      },
    },
    data: {
      name: productDetail.name || undefined,
      price: productDetail.price || undefined,
      inventory: {
        update: {
          data: {
            quantity: productDetail.quantity
              ? parseInt(productDetail.quantity)
              : undefined,
          },
        },
      },
    },
  });

  if (updateProduct) return updateProduct;
  throw new AppError(`Бүтээгдэхүүн шинэчлэгдсэнгүй!`, 500);
};
exports.deleteProduct = async (productId) => {
  const existingProduct = await db.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
  if (!existingProduct) throw new AppError("Бүтээгдэхүүн байхгүй байна", 409);
  const deleteProduct = await db.product.delete({
    where: {
      id: parseInt(productId),
    },
  });

  if (deleteProduct) return deleteProduct;
  throw new AppError(`Бүтээгдэхүүн устгагдсангүй!`, 500);
};
