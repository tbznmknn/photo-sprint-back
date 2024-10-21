const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const vendorRoutes = require("./vendorRoutes");
const orderRoutes = require("./orderRoutes");
const couponRoutes = require("./couponRoutes");
const paymentRoutes = require("./paymentRoutes");
const analyticRoutes = require("./analyticRoutes");

const router = express.Router();

router.use("/auth", authRoutes); //++++++
router.use("/users", userRoutes); //++++++
router.use("/products", productRoutes); //++++++

router.use("/vendors", vendorRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/payments", paymentRoutes);
router.use("/analytics", analyticRoutes);

module.exports = router;
