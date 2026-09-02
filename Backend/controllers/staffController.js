import User from '../models/userModel.js';

// ---------------- GET ALL STAFF ----------------
export const getStaffMembers = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');
    return res.status(200).json({ success: true, staff });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- REMOVE STAFF ACCESS ----------------
export const removeStaffAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Downgrade role back to customer instead of completely deleting the user account
    user.role = 'customer';
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Staff access revoked successfully. User role changed to customer.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};