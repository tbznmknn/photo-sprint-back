const catchAsync = require("../utils/catchAsync");
const vendorServices = require("../services/vendorServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
exports.createVendor = catchAsync(async (req, res, next) => {
  const vendor = await vendorServices.createVendor(req.body);
  res.status(201).json({
    success: true,
    data: vendor,
  });
});
exports.getVendors = catchAsync(async (req, res, next) => {
  const { vendors, pagination } = await vendorServices.getVendors(
    req.userId,
    req.query
  );
  return res.status(200).json({
    success: true,
    data: vendors,
    pagination,
    message: "Амжилттай авлаа",
  });
});
exports.getVendorDetailAdmin = catchAsync(async (req, res, next) => {
  const vendor = await vendorServices.getVendorDetail(parseInt(req.params.id));
  return res.status(200).json({
    success: true,
    data: vendor,
    message: "Амжилттай авлаа",
  });
});
exports.getUserDetailBySameUser = catchAsync(async (req, res, next) => {
  const vendorId = await vendorServices.getVendorIdByUserId(req.userId);
  const vendor = await vendorServices.getVendorDetail(vendorId);
  return res.status(200).json({
    success: true,
    data: vendor,
    message: "Амжилттай авлаа",
  });
});
exports.editVendorDetailAdmin = catchAsync(async (req, res, next) => {
  const user = await vendorServices.editVendorDetail(
    parseInt(req.params.id),
    req.body
  );
  return res.status(200).json({
    success: true,
    data: user,
    message: "Амжилттай хэрэглэгчийн мэдээлэл шинэчлэгдлээ",
  });
});
exports.editVendorDetailSameUser = catchAsync(async (req, res, next) => {
  const vendorId = await vendorServices.getVendorIdByUserId(req.userId);
  const vendor = await vendorServices.editVendorDetail(vendorId, req.body);
  return res.status(200).json({
    success: true,
    data: vendor,
    message: "Амжилттай авлаа",
  });
});
