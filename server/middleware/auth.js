import jwt from "jsonwebtoken";
import User from "../models/User.js";

export  const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    // handle "Bearer <token>" or raw token
    let token = authHeader;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded);
        const userId = decoded?.userId || decoded?.userid || decoded?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
        req.user = await User.findById(userId).select('-password');
        next();
    }
    catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
}