
const express = require("express");
const Registration = require("../models/Registration");

const router = express.Router();

// Create a registration
router.post("/", async (req, res) => {
  try {
    const { name, usn, email, phone, institution, year, event } = req.body;

    if (!name || !usn || !email || !phone || !institution || !year || !event) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const cleanName = name.trim();
    const cleanUsn = usn.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (cleanUsn.length < 5) {
      return res.status(400).json({
        success: false,
        message: "USN must contain at least 5 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain 10 digits.",
      });
    }

    // First 4 letters of the name + last 5 characters of the USN
    const namePart =
      cleanName.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase();

    if (namePart.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 4 letters for the Registration ID.",
      });
    }

    const registrationId =
      namePart + cleanUsn.slice(-5);

    // Prevent duplicate registration IDs
    const existing = await Registration.findOne({ registrationId });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "This Registration ID already exists. Please contact the organizers.",
      });
    }

    const registration = await Registration.create({
      registrationId,
      name: cleanName,
      usn: cleanUsn,
      email: cleanEmail,
      phone: cleanPhone,
      institution: institution.trim(),
      year,
      event,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        registrationId: registration.registrationId,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This Registration ID already exists. Please contact the organizers.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// Fetch registration details using the custom Registration ID
router.get("/:id", async (req, res) => {
  try {
    const registration = await Registration.findOne({
      registrationId: req.params.id.toUpperCase(),
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration details not found.",
      });
    }

    return res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Fetch registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch registration details.",
    });
  }
});

module.exports = router;
