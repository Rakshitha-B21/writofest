
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Temporary registration schema
const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    },
    event: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

// Create a registration
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, institution, year, event } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !institution?.trim() ||
      !year ||
      !event
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    const registration = await Registration.create({
      name,
      email,
      phone,
      institution,
      year,
      event,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        registrationId: registration._id,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to complete registration. Please try again.",
    });
  }
});

module.exports = router;
