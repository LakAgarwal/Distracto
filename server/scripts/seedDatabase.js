import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = [
  {
    email: 'admin@distracto.com',
    password: 'admin123',
    displayName: 'Admin User',
    preferences: {
      distractoId: 'admin',
      goal: 'Manage the platform',
      occupation: 'Administrator',
      interests: ['Management', 'Technology']
    }
  },
  {
    email: 'demo@distracto.com',
    password: 'demo123',
    displayName: 'Demo User',
    preferences: {
      distractoId: 'demo',
      goal: 'Improve productivity',
      occupation: 'Software Developer',
      interests: ['Coding', 'Productivity', 'Technology']
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/distracto');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create seed users
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email}`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();