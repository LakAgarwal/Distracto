import express from 'express';
import Timetable from '../models/Timetable.js';

const router = express.Router();

// Get timetables for user
router.get('/', async (req, res) => {
  try {
    const { date, limit = 10 } = req.query;
    let query = { userId: req.user._id };
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      query.date = targetDate;
    }

    const timetables = await Timetable.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(timetables);
  } catch (error) {
    console.error('Get timetables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new timetable
router.post('/', async (req, res) => {
  try {
    const timetable = new Timetable({
      ...req.body,
      userId: req.user._id
    });

    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    console.error('Create timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update timetable
router.put('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json(timetable);
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete timetable
router.delete('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;