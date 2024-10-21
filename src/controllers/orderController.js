const catchAsync = require("../utils/catchAsync");
const orderServices = require("../services/orderServices");
const AppError = require("../utils/AppError");
// const { createOrderchemas } = require("../schemas/productSchema");

// const { logger } = require("../utils/logger");
exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await orderServices.createOrder(req.body, images);
  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { products, pagination } = await orderServices.getOrders(req.query);
  res.status(200).json({
    success: true,
    data: products,
    pagination,
  });
});
exports.getOrderDetails = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await orderServices.getOrderDetails(productId);
  res.status(200).json({
    success: true,
    data: product,
  });
});
exports.updateOrder = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await orderServices.updateOrder(productId, req.body);
  res.status(200).json({
    success: true,
    data: product,
  });
});
// exports.deleteOrder = catchAsync(async (req, res, next) => {
//   const productId = req.params.id;
//   const product = await orderServices.deleteOrder(productId);
//   res.status(200).json({
//     success: true,
//     data: product,
//   });
// });
