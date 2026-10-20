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
    name: { type: String, required: true, trim: true },
    usn: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    event: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);
