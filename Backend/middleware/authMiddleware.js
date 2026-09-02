import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Clean token string (removes stray quotes or whitespace)
      token = req.headers.authorization.split(' ')[1]?.replace(/^["']|["']$/g, '');

      if (!token || token === 'null' || token === 'undefined') {
        console.warn('❌ [Protect Middleware] Invalid token string received:', token);
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' });
      }

      // 2. Ensure JWT_SECRET is loaded
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('🔥 [Protect Middleware] CRITICAL: process.env.JWT_SECRET is missing!');
        return res.status(500).json({ success: false, message: 'Server authentication misconfiguration' });
      }

      // 3. Verify JWT
      const decoded = jwt.verify(token, secret);

      // 🔑 4. ENV ADMIN CHECK
      if (
        decoded.id === 'admin_env_id' ||
        (decoded.role === 'admin' && decoded.id === 'admin_env_id')
      ) {
        req.user = {
          _id: 'admin_env_id',
          id: 'admin_env_id',
          name: 'System Administrator',
          email: process.env.ADMIN_EMAIL || 'admin@travelgo.com',
          role: 'admin',
          isAdmin: true,
          isStaff: false,
        };
        return next();
      }

      // 🔑 5. MongoDB User Check (Handles Customers, Database Staff, and DB Admins)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.warn(`❌ [Protect Middleware] User ID [${decoded.id}] not found in DB`);
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      req.user = {
        ...user._doc,
        role: user.role || 'customer',
        isAdmin: user.role === 'admin',
        isStaff: user.role === 'staff',
      };

      return next();
    } catch (error) {
      console.error('❌ [Protect Middleware Error]:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed', 
        error: error.message 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// 🔒 STRICT ADMIN ONLY (Blocks Staff)
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator permissions required',
    });
  }
};

// 🔒 STAFF OR ADMIN ACCESS (Allows both staff and admin, blocks customers)
export const staffOrAdmin = (req, res, next) => {
  if (
    req.user && 
    (req.user.role === 'admin' || req.user.role === 'staff' || req.user.isAdmin || req.user.isStaff)
  ) {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Staff or Admin permissions required',
    });
  }
};