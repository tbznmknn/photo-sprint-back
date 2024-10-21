// schemas/userSchema.js
const { z } = require("zod");
const {
  optionalString,
  optionalNumber,
  optionalBoolean,
  requiredString,
  requiredNumber,
  // optionalDate,
} = require("./constantValidation");

// Define Zod schema for user registration
exports.createProductSchemas = z.object({
  name: z.string().min(1, "Enter name of the products"),
  description: requiredString,
  price: requiredNumber,
  vendorId: requiredNumber,

  discountId: optionalNumber,
  promotionId: optionalNumber,
  flashSale: optionalBoolean,
  flashSaleEndDate: optionalString,
});
