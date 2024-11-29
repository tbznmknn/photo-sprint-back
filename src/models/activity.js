"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for an Activity.
 */
const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "Photo Upload",
      "New Comment",
      "User Register",
      "User Login",
      "User Logout",
    ],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User performing the activity
  photo: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" }, // Optional: Photo involved
  date_time: { type: Date, default: Date.now }, // Timestamp
});

/**
 * Create a Mongoose Model for an Activity.
 */
const Activity = mongoose.model("Activity", activitySchema);

/**
 * Make this available to our application.
 */
module.exports = Activity;
