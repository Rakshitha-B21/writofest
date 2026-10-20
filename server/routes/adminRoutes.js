const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Registration = require("../models/Registration");
const {
  TOKEN_ISSUER,
  getAdminConfig,
  requireAdmin,
} = require("../middleware/adminAuth");

const router = express.Router();
const VALID_EVENTS = ["writing", "pop-up-quiz", "open-mic", "storytelling"];
const TOKEN_AUDIENCE = "writofest-admin-dashboard";
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const readFilters = (query) => {
  if (
    (query.search !== undefined && typeof query.search !== "string") ||
    (query.event !== undefined && typeof query.event !== "string")
  ) {
    return { error: "Search and event filters must be single text values." };
  }

  const search = typeof query.search === "string" ? query.search.trim() : "";
  const event = typeof query.event === "string" ? query.event.trim() : "";

  if (search.length > 100) {
    return { error: "Search text must be 100 characters or fewer." };
  }
  if (event && !VALID_EVENTS.includes(event)) {
    return { error: "Please select a valid event." };
  }

  const filters = {};
  if (event) filters.event = event;
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchPattern = new RegExp(escapedSearch, "i");
    filters.$or = [
      { name: searchPattern },
      { usn: searchPattern },
      { registrationId: searchPattern },
    ];
  }

  return { filters };
};

const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
};

const toCsv = (registrations) => {
  const columns = [
    ["Registration ID", "registrationId"],
    ["Name", "name"],
    ["USN", "usn"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Institution", "institution"],
    ["Year", "year"],
    ["Event", "event"],
    ["Registered At", "createdAt"],
  ];
  const rows = [
    columns.map(([label]) => csvCell(label)).join(","),
    ...registrations.map((registration) =>
      columns
        .map(([, key]) =>
          csvCell(
            key === "createdAt" && registration[key]
              ? new Date(registration[key]).toISOString()
              : registration[key]
          )
        )
        .join(",")
    ),
  ];

  return `\uFEFF${rows.join("\r\n")}`;
};

router.post("/login", loginLimiter, async (req, res) => {
  const config = getAdminConfig();
  if (!config) {
    return res.status(503).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
  }

  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const passwordMatches = await bcrypt.compare(password, config.passwordHash);
    if (username.trim() !== config.username || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      config.secret,
      {
        subject: config.username,
        issuer: TOKEN_ISSUER,
        audience: TOKEN_AUDIENCE,
        expiresIn: "8h",
      }
    );

    res.set("Cache-Control", "no-store");
    return res.json({ success: true, token });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to complete admin login.",
    });
  }
});

router.post("/logout", requireAdmin, (_req, res) => {
  res.json({ success: true, message: "Admin session ended." });
});

router.get("/me", requireAdmin, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ success: true, data: { username: req.admin.username } });
});

router.get("/registrations/export", requireAdmin, async (req, res) => {
  const { filters, error } = readFilters(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const registrations = await Registration.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    res.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="writofest-registrations.csv"',
      "Cache-Control": "no-store",
    });
    return res.send(toCsv(registrations));
  } catch (error) {
    console.error("Admin registration export error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to export registrations.",
    });
  }
});

router.get("/registrations", requireAdmin, async (req, res) => {
  const { filters, error } = readFilters(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Page must be positive and limit must be between 1 and 100.",
    });
  }

  try {
    const [registrations, matchingTotal, allTotal, eventCounts] = await Promise.all([
      Registration.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Registration.countDocuments(filters),
      Registration.countDocuments(),
      Registration.aggregate([
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]),
    ]);

    const byEvent = Object.fromEntries(VALID_EVENTS.map((event) => [event, 0]));
    eventCounts.forEach(({ _id, count }) => {
      if (Object.hasOwn(byEvent, _id)) byEvent[_id] = count;
    });

    res.set("Cache-Control", "no-store");
    return res.json({
      success: true,
      data: {
        registrations,
        total: matchingTotal,
        page,
        limit,
        stats: { total: allTotal, byEvent },
      },
    });
  } catch (error) {
    console.error("Admin registrations error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load registrations.",
    });
  }
});

module.exports = router;
