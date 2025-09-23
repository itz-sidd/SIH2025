const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Room.deleteMany({});
    await Message.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@mindease.com',
      password: 'admin123' // Will be hashed automatically
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create demo users
    const demoUsers = [];
    for (let i = 1; i <= 5; i++) {
      const user = new User({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: 'password123'
      });
      await user.save();
      demoUsers.push(user);
    }
    console.log('👥 Created demo users');

    // Create default rooms
    const defaultRooms = [
      {
        name: 'General Support',
        description: 'A safe space for general mental health discussions and peer support. Share your experiences and connect with others on similar journeys.',
        category: 'support',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.slice(0, 3).map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Be respectful and kind to all members',
          'No judgment or discrimination',
          'Keep conversations supportive',
          'Respect privacy and confidentiality'
        ],
        tags: ['support', 'community', 'mental-health']
      },
      {
        name: 'Anxiety & Stress Management',
        description: 'Connect with others managing anxiety and stress. Share coping strategies, resources, and find support during difficult times.',
        category: 'wellness',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.slice(1, 4).map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Focus on constructive support',
          'Share coping strategies and resources',
          'Be patient with yourself and others',
          'Professional advice should come from qualified practitioners'
        ],
        tags: ['anxiety', 'stress', 'coping', 'wellness']
      },
      {
        name: 'Mindfulness & Meditation',
        description: 'Explore mindfulness practices together. Share meditation experiences, techniques, and support each other\'s mindfulness journey.',
        category: 'mindfulness',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.slice(0, 4).map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Focus on mindfulness and meditation practices',
          'Share experiences and techniques',
          'Be present and mindful in discussions',
          'Respect different approaches to mindfulness'
        ],
        tags: ['mindfulness', 'meditation', 'peace', 'present']
      },
      {
        name: 'Daily Check-ins',
        description: 'Start or end your day with supportive check-ins. Share how you\'re feeling and offer encouragement to others.',
        category: 'general',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Daily check-ins welcome',
          'Be genuine about your feelings',
          'Offer support to others',
          'Celebrate small wins together'
        ],
        tags: ['daily', 'check-in', 'routine', 'support']
      },
      {
        name: 'Therapy & Professional Support',
        description: 'Discuss therapy experiences, find resources, and support each other in professional mental health journeys.',
        category: 'therapy',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.slice(2, 5).map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Share therapy experiences respectfully',
          'No diagnosing or medical advice',
          'Respect confidentiality',
          'Focus on finding and supporting professional help'
        ],
        tags: ['therapy', 'counseling', 'professional', 'resources']
      },
      {
        name: 'Peer Support Circle',
        description: 'A dedicated space for peer-to-peer support. Connect with others who understand your experiences and challenges.',
        category: 'peer-support',
        creator: adminUser._id,
        members: [adminUser._id, ...demoUsers.slice(1, 5).map(u => u._id)],
        moderators: [adminUser._id],
        rules: [
          'Peer support is the focus',
          'Share experiences to help others',
          'Listen actively and empathetically',
          'Maintain confidentiality and trust'
        ],
        tags: ['peer-support', 'shared-experience', 'understanding']
      }
    ];

    const createdRooms = [];
    for (const roomData of defaultRooms) {
      const room = new Room(roomData);
      await room.save();
      createdRooms.push(room);
    }
    console.log('🏠 Created default rooms');

    // Create some sample messages for each room
    const sampleMessages = [
      'Welcome to this supportive community! Feel free to share and connect.',
      'Remember, every small step toward better mental health is valuable.',
      'This is a safe space where your feelings and experiences are valid.',
      'Looking forward to supporting each other on this journey.',
      'Thank you for creating such a welcoming environment for everyone.'
    ];

    for (const room of createdRooms) {
      // Add a few messages to each room
      for (let i = 0; i < 3; i++) {
        const randomUser = i === 0 ? adminUser : demoUsers[Math.floor(Math.random() * demoUsers.length)];
        const message = new Message({
          content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
          sender: randomUser._id,
          room: room._id,
          timestamp: new Date(Date.now() - (Math.random() * 24 * 60 * 60 * 1000)) // Random time in last 24 hours
        });
        await message.save();
        
        // Update room's last message
        room.lastMessage = message.content.substring(0, 100);
        room.lastActivity = message.timestamp;
        await room.save();
      }
    }
    console.log('💬 Created sample messages');

    console.log('✅ Database seeding completed successfully!');
    console.log('\nCreated:');
    console.log(`- 1 admin user (admin@mindease.com / admin123)`);
    console.log(`- 5 demo users (user1@example.com / password123, etc.)`);
    console.log(`- ${createdRooms.length} default chat rooms`);
    console.log(`- Sample messages in each room`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
