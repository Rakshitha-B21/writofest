
const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Get all active events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

// Add a new event
router.post("/", async (req, res) => {
  try {
    const { name, description, date, venue, imageUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event name is required",
      });
    }

    const event = await Event.create({
      name: name.trim(),
      description,
      date,
      venue,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create event",
    });
  }
});

module.exports = router;
