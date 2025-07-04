import mongoose from 'mongoose';

const blockedSiteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  blockType: {
    type: String,
    enum: ['always', 'scheduled'],
    default: 'always'
  },
  scheduleStart: String,
  scheduleEnd: String,
  blockedCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('BlockedSite', blockedSiteSchema);