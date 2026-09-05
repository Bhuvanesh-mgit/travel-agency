import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ---------------- 1. REGISTER USER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, password, secretKey } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
    if (envAdminEmail && email === envAdminEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email is reserved for system administration. Please log in.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Account already exists with this email. Please log in.',
      });
    }

    // Determine role based on secret registration key
    let assignedRole = 'customer';
    if (secretKey && secretKey === process.env.STAFF_SECRET_KEY) {
      assignedRole = 'staff';
    }

    const newUser = await User.create({
      name: name.trim(),
      email,
      password, 
      role: assignedRole,
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        
        role: newUser.role,
        avatar: newUser?.avatar || '',
        isAdmin: newUser.role === 'admin',
        isStaff: newUser.role === 'staff',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- 2. LOGIN USER ----------------
export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    // 🔑 STEP A: Check Backend .env Super Admin Credentials
    const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    if (envAdminEmail && envAdminPassword && email === envAdminEmail && password === envAdminPassword) {
      const adminId = 'admin_env_id';
      const role = 'admin';
      const token = generateToken(adminId, role);

      console.log(`⚡ ENV Admin logged in successfully: [${email}]`);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: adminId,
          id: adminId,
          name: 'System Administrator',
          email: envAdminEmail,
          role: role,
          isAdmin: true,
          isStaff: false,
        },
      });
    }

    // 🔑 STEP B: Check MongoDB Users (Includes Database Staff & Customers)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email. Please register first.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || 'other',
        avatar: user?.avatar || '',
        role: user.role,
        isAdmin: user.role === 'admin',
        isStaff: user.role === 'staff',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- 3. GET USER PROFILE ----------------
export const getUserProfile = async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?._id;

    // Check if current token belongs to the ENV Admin
    if (currentUserId === 'admin_env_id') {
      return res.status(200).json({
        success: true,
        user: {
          _id: 'admin_env_id',
          id: 'admin_env_id',
          name: 'System Administrator',
          phone: '',
          gender: 'other',
          avatar: '',
          email: process.env.ADMIN_EMAIL,
          role: 'admin',
          isAdmin: true,
          isStaff: false,
        },
      });
    }

    const user = await User.findById(currentUserId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || 'other',
        role: user.role,
        avatar: user?.avatar || '',
        isAdmin: user.role === 'admin',
        isStaff: user.role === 'staff',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- 4. GET ALL USERS (FOR MANAGEMENT) ----------------
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    // Map boolean isActive to frontend status format
    const formattedUsers = users.map(user => ({
      ...user._doc,
      status: user.isActive ? 'Active' : 'Inactive',
    }));

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- 5. CREATE USER (ADMIN ACTION) ----------------
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, password, status } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password, // Automatically hashed by your pre-save schema hook
      phone: phone || '',
      role: role || 'customer',
      isActive: status !== undefined ? status === 'Active' : true,
    });

    const userResponse = {
      ...newUser._doc,
      status: newUser.isActive ? 'Active' : 'Inactive',
    };
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
// ---------------- UPDATE LOGGED-IN USER PROFILE ----------------
export const updateProfile = async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?._id;

    if (currentUserId === 'admin_env_id') {
      return res.status(400).json({
        success: false,
        message: 'System Administrator profile cannot be updated via client panel.',
      });
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name ? req.body.name.trim() : user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone.trim() : user.phone;
    user.gender = req.body.gender ? req.body.gender.trim() : user.gender;

    // If Multer uploaded a new image to Cloudinary, save the URL
    if (req.file && req.file.path) {
      user.avatar = req.file.path;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id, updatedUser.role);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      token,
      user: {
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        gender: updatedUser.gender || 'male',
        avatar: updatedUser.avatar || '',
        role: updatedUser.role,
        isAdmin: updatedUser.role === 'admin',
        isStaff: updatedUser.role === 'staff',
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- UPDATE USER (ADMIN PANEL) ----------------
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, role, status, password, gender } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (role) updateData.role = role;
    if (status !== undefined) {
      updateData.isActive = status === 'Active';
    }

    // 🔑 If admin uploaded a new profile image file via multer
    if (req.file && req.file.path) {
      updateData.avatar = req.file.path;
    }

    // If a new password is provided, hash it manually
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userResponse = {
      ...updatedUser._doc,
      status: updatedUser.isActive ? 'Active' : 'Inactive',
    };

    return res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
// ---------------- 7. DELETE USER ----------------
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};