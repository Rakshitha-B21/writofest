
const express = require("express");
const Registration = require("../models/Registration");

const router = express.Router();

const ALLOWED_EVENTS = [
  "writing",
  "open-mic",
  "quiz",
];

router.post("/", async (req, res) => {
  try {
    const {
      name,
      usn,
      email,
      phone,
      institution,
      year,
      events: submittedEvents,
      event: submittedEvent,
    } = req.body;

    const selectedEvents = Array.isArray(submittedEvents)
      ? submittedEvents
      : submittedEvent
        ? [submittedEvent]
        : [];

    if (
      !name?.trim() ||
      !usn?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !institution?.trim() ||
      !year ||
      selectedEvents.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields and select at least one event.",
      });
    }

    const cleanName = name.trim();
    const cleanUsn = usn.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanInstitution = institution.trim();

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

    if (!["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"].includes(year)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid year of study.",
      });
    }

    const cleanEvents = [...new Set(
      selectedEvents.map((item) => String(item).trim().toLowerCase())
    )];

    if (cleanEvents.some((item) => !ALLOWED_EVENTS.includes(item))) {
      return res.status(400).json({
        success: false,
        message: "One or more selected events are invalid.",
      });
    }

    // First 4 letters of name + last 5 characters of USN
    const namePart = cleanName
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 4)
      .toUpperCase();

    if (namePart.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 4 letters for the Registration ID.",
      });
    }

    const registrationId = namePart + cleanUsn.slice(-5);

    const existing = await Registration.findOne({ registrationId });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This Registration ID already exists. Please contact the organizers.",
      });
    }

    const registration = await Registration.create({
      registrationId,
      name: cleanName,
      usn: cleanUsn,
      email: cleanEmail,
      phone: cleanPhone,
      institution: cleanInstitution,
      year,
      events: cleanEvents,
      // Retained for compatibility with existing dashboard code.
      event: cleanEvents.join(", "),
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
