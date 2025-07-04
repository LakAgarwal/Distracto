import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'displayName email photoURL')
      .populate('following', 'displayName email photoURL');
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', [
  body('displayName').optional().trim().isLength({ min: 2 }),
  body('preferences.distractoId').optional().trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    let searchQuery = {};
    
    if (type === 'distractoId') {
      searchQuery = {
        'preferences.distractoId': { $regex: q, $options: 'i' }
      };
    } else {
      searchQuery = {
        $or: [
          { displayName: { $regex: q, $options: 'i' } },
          { 'preferences.distractoId': { $regex: q, $options: 'i' } }
        ]
      };
    }

    // Exclude current user from results
    searchQuery._id = { $ne: req.user._id };

    const users = await User.find(searchQuery)
      .select('displayName email photoURL preferences')
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.post('/follow/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userId }
    });

    // Add to followers list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUserId }
    });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow user
router.delete('/follow/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Remove from following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId }
    });

    // Remove from followers list
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId }
    });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;