import User from "../modules/auth/auth.model.js";

/**
 * Middleware to check if user is an admin
 * Must be used after authMiddleware
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default adminMiddleware;





