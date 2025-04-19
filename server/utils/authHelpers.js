import jwt from "jsonwebtoken";

/**
 * Creates a JWT and sends it as an HttpOnly cookie.
 * @param {Object} res - Express response object
 * @param {Object} user - The user object with _id, email, name, picture, role
 */
export const createAndSendToken = (res, user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name || null,
    picture: user.picture || null,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "production",
    sameSite: process.env.SAME_SITE || "Lax",
    maxAge: 60 * 60 * 1000,
  });

  return token;
};
