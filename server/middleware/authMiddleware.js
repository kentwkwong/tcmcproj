import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(200).json({ user: null, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches user data to the request
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
