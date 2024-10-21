const catchAsync = require("../utils/catchAsync");
const productServices = require("../services/productServices");
const AppError = require("../utils/AppError");
const { createProductSchemas } = require("../schemas/productSchema");

// const { logger } = require("../utils/logger");
exports.createProducts = catchAsync(async (req, res, next) => {
  console.log(req.files);
  console.log(req.body);
  if (!req.files || req.files.length === 0) {
    throw new AppError("No images uploaded.", 400);
  }
  const images = req.files.map((file) => ({
    imageUrl: `/uploads/products/${file.filename}`,
    altText: file.originalname,
  }));
  const user = await productServices.createProducts(req.body, images);
  res.status(201).json({
    success: true,
    data: user,
    message: "Бүтээгдэхүүн амжилттай бүртгэгдлээ",
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const { products, pagination } = await productServices.getProducts(req.query);
  res.status(200).json({
    success: true,
    data: products,
    pagination,
  });
});
exports.getProductDetails = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productServices.getProductDetails(productId);
  res.status(200).json({
    success: true,
    data: product,
  });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productServices.updateProduct(productId, req.body);
  res.status(200).json({
    success: true,
    data: product,
  });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productServices.deleteProduct(productId);
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.test = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, message: "test" });
});
