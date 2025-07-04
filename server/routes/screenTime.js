import express from 'express';
import ScreenTime from '../models/ScreenTime.js';

const router = express.Router();

// Get screen time data for a specific date
router.get('/:date?', async (req, res) => {
  try {
    const date = req.params.date ? new Date(req.params.date) : new Date();
    date.setHours(0, 0, 0, 0);

    let screenTime = await ScreenTime.findOne({
      userId: req.user._id,
      date
    });

    if (!screenTime) {
      // Create default entry for the day
      screenTime = new ScreenTime({
        userId: req.user._id,
        date,
        totalTime: 0,
        productiveTime: 0,
        unproductiveTime: 0,
        topSites: [],
        deviceData: []
      });
      await screenTime.save();
    }

    res.json(screenTime);
  } catch (error) {
    console.error('Get screen time error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update screen time data
router.put('/:date?', async (req, res) => {
  try {
    const date = req.params.date ? new Date(req.params.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const updateData = {
      ...req.body,
      userId: req.user._id,
      date
    };

    const screenTime = await ScreenTime.findOneAndUpdate(
      { userId: req.user._id, date },
      updateData,
      { new: true, upsert: true }
    );

    res.json(screenTime);
  } catch (error) {
    console.error('Update screen time error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly screen time data
router.get('/weekly/:startDate', async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const weeklyData = await ScreenTime.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(weeklyData);
  } catch (error) {
    console.error('Get weekly screen time error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;