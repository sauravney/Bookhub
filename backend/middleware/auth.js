import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧾 Decoded JWT:", decoded); // Optional: log for debugging
    req.userId = decoded.id; // ✅ Use 'id' here
    console.log("📦 Headers:", req.headers);
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateUser;
