import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  time: String,
  description: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  title: String,
  prompt: String,
  tasks: [taskSchema],
  recommendations: [String],
  aiModel: {
    type: String,
    default: 'gemini-1.5-flash'
  }
}, {
  timestamps: true
});

export default mongoose.model('Timetable', timetableSchema);