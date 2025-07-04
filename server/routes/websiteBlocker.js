import express from 'express';
import BlockedSite from '../models/BlockedSite.js';

const router = express.Router();

// Get all blocked sites for user
router.get('/', async (req, res) => {
  try {
    const blockedSites = await BlockedSite.find({ userId: req.user._id });
    res.json(blockedSites);
  } catch (error) {
    console.error('Get blocked sites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new blocked site
router.post('/', async (req, res) => {
  try {
    const blockedSite = new BlockedSite({
      ...req.body,
      userId: req.user._id
    });

    await blockedSite.save();
    res.status(201).json(blockedSite);
  } catch (error) {
    console.error('Add blocked site error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blocked site
router.put('/:id', async (req, res) => {
  try {
    const blockedSite = await BlockedSite.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!blockedSite) {
      return res.status(404).json({ message: 'Blocked site not found' });
    }

    res.json(blockedSite);
  } catch (error) {
    console.error('Update blocked site error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blocked site
router.delete('/:id', async (req, res) => {
  try {
    const blockedSite = await BlockedSite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!blockedSite) {
      return res.status(404).json({ message: 'Blocked site not found' });
    }

    res.json({ message: 'Blocked site deleted successfully' });
  } catch (error) {
    console.error('Delete blocked site error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;