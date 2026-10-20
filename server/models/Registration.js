
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    usn: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    institution: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      required: true,
      trim: true,
    },

    // Compatibility with the existing registration route/dashboard
    event: {
      type: String,
      trim: true,
      default: "",
    },

    // Allows participants to select multiple events
    events: {
      type: [String],
      required: true,
      validate: {
        validator: (events) =>
          Array.isArray(events) && events.length > 0,
        message: "Please select at least one event.",
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);
