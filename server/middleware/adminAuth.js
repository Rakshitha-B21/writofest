const jwt = require("jsonwebtoken");

const TOKEN_ISSUER = "writofest-admin";

const getAdminConfig = () => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    return null;
  }

  if (JWT_SECRET.length < 32) {
    return null;
  }

  return {
    username: ADMIN_USERNAME,
    passwordHash: ADMIN_PASSWORD_HASH,
    secret: JWT_SECRET,
  };
};

const requireAdmin = (req, res, next) => {
  const config = getAdminConfig();
  if (!config) {
    return res.status(503).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
  }

  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication is required.",
    });
  }

  try {
    const payload = jwt.verify(token, config.secret, {
      issuer: TOKEN_ISSUER,
      audience: "writofest-admin-dashboard",
    });

    if (payload.sub !== config.username || payload.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin authentication is required.",
      });
    }

    req.admin = { username: payload.sub };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Admin session is invalid or expired.",
    });
  }
};

module.exports = { TOKEN_ISSUER, getAdminConfig, requireAdmin };
