
const express = require("express");
const Registration = require("../models/Registration");

const router = express.Router();

// POST: Register for an event
router.post("/", async (req, res) => {
  try {
    const {
      name,
      usn,
      email,
      phone,
      institution,
      year,
      event,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !usn ||
      !email ||
      !phone ||
      !institution ||
      !year ||
      !event
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const cleanName = name.trim();
    const cleanUsn = usn.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Validate name
    if (!/^[a-zA-Z\s.'-]+$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name.",
      });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate 10-digit phone number
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain exactly 10 digits.",
      });
    }

    // Validate USN
    if (!/^[A-Z0-9]+$/.test(cleanUsn)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid USN.",
      });
    }

    // Generate custom registration ID:
    // First 4 letters of the name + last 5 characters of USN
    const namePart = cleanName
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 4)
      .toUpperCase();

    const usnPart = cleanUsn.slice(-5);

    if (!namePart || usnPart.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Unable to generate registration ID. Check your name and USN.",
      });
    }

    const registrationId = `${namePart}${usnPart}`;

    // Create registration — IMPORTANT: include registrationId
    const registration = await Registration.create({
      registrationId,
      name: cleanName,
      usn: cleanUsn,
      email: cleanEmail,
      phone: cleanPhone,
      institution: institution.trim(),
      year: String(year).trim(),
      event: String(event).trim(),
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

    // Handle duplicate registration IDs
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This registration ID already exists. Please contact the event organizers.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Registration validation failed.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// GET: Find registration using custom registration ID
router.get("/:id", async (req, res) => {
  try {
    const registrationId = req.params.id.trim().toUpperCase();

    const registration = await Registration.findOne({
      registrationId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch registration details.",
    });
  }
});

module.exports = router;
