import mongoose from 'mongoose';

const appUsageSchema = new mongoose.Schema({
  name: String,
  minutes: Number,
  category: {
    type: String,
    enum: ['Productivity', 'Communication', 'Entertainment', 'Social Media', 'News', 'Shopping', 'Other']
  }
});

const screenTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalTime: {
    type: Number,
    default: 0
  },
  productiveTime: {
    type: Number,
    default: 0
  },
  unproductiveTime: {
    type: Number,
    default: 0
  },
  topSites: [appUsageSchema],
  deviceData: [{
    deviceName: String,
    timeSpent: Number,
    apps: [appUsageSchema]
  }],
  extensionData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Ensure one record per user per date
screenTimeSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('ScreenTime', screenTimeSchema);