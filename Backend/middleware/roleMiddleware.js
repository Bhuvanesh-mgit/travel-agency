export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Fallback: If req.user.role isn't defined, derive it from req.user.isAdmin
    const userRole =
      req.user?.role ||
      (req.user?.isAdmin ? 'admin' : 'user');

    if (!req.user || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role '${userRole || 'Guest'}' is not authorized to perform this action.`,
      });
    }

    next();
  };
};