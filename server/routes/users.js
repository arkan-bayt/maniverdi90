const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireSuperuser } = require('../middleware/auth');

const router = express.Router();

// Get all users (superuser only)
router.get('/', authenticateToken, requireSuperuser, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (superuser only)
router.post('/', authenticateToken, requireSuperuser, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    if (password.length < 3) {
      return res.status(400).json({ message: 'Password must be at least 3 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      role: role || 'user',
      createdBy: req.user._id
    });

    await newUser.save();

    // Return user without password
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (superuser only)
router.put('/:id', authenticateToken, requireSuperuser, async (req, res) => {
  try {
    const { username, role, isActive } = req.body;
    const userId = req.params.id;

    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (superuser only)
router.delete('/:id', authenticateToken, requireSuperuser, async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow deleting own account
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;