const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Board = require('../src/models/Board');
const Task = require('../src/models/Task');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-board');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'password123',
    preferences: {
      theme: 'dark',
      language: 'en'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    passwordHash: 'password123',
    preferences: {
      theme: 'light',
      language: 'en'
    }
  }
];

const sampleBoards = [
  {
    title: 'Project Alpha',
    description: 'Main project board for Alpha development',
    columns: [
      { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' },
      { id: 'in-progress', name: 'In Progress', order: 1, color: '#3B82F6' },
      { id: 'review', name: 'Review', order: 2, color: '#F59E0B' },
      { id: 'done', name: 'Done', order: 3, color: '#10B981' }
    ]
  },
  {
    title: 'Personal Tasks',
    description: 'Personal task management board',
    columns: [
      { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' },
      { id: 'in-progress', name: 'In Progress', order: 1, color: '#3B82F6' },
      { id: 'done', name: 'Done', order: 2, color: '#10B981' }
    ]
  }
];

const sampleTasks = [
  {
    title: 'Design user interface',
    description: 'Create wireframes and mockups for the main dashboard',
    status: 'todo',
    priority: 'High',
    labels: ['design', 'ui/ux'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    subtasks: [
      { title: 'Create wireframes', completed: false },
      { title: 'Design color scheme', completed: false },
      { title: 'Create component library', completed: false }
    ]
  },
  {
    title: 'Set up database',
    description: 'Configure MongoDB and create initial schemas',
    status: 'in-progress',
    priority: 'High',
    labels: ['backend', 'database'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    subtasks: [
      { title: 'Install MongoDB', completed: true },
      { title: 'Create user schema', completed: true },
      { title: 'Create board schema', completed: false },
      { title: 'Create task schema', completed: false }
    ]
  },
  {
    title: 'Implement authentication',
    description: 'Add JWT-based authentication system',
    status: 'in-progress',
    priority: 'Medium',
    labels: ['backend', 'auth'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    subtasks: [
      { title: 'Create auth middleware', completed: true },
      { title: 'Implement login endpoint', completed: true },
      { title: 'Implement register endpoint', completed: false },
      { title: 'Add password hashing', completed: true }
    ]
  },
  {
    title: 'Create React components',
    description: 'Build reusable React components for the frontend',
    status: 'review',
    priority: 'Medium',
    labels: ['frontend', 'react'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    subtasks: [
      { title: 'Create Board component', completed: true },
      { title: 'Create Task component', completed: true },
      { title: 'Create Column component', completed: false }
    ]
  },
  {
    title: 'Add drag and drop functionality',
    description: 'Implement react-beautiful-dnd for task movement',
    status: 'done',
    priority: 'High',
    labels: ['frontend', 'drag-drop'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    subtasks: [
      { title: 'Install react-beautiful-dnd', completed: true },
      { title: 'Implement task dragging', completed: true },
      { title: 'Implement column reordering', completed: true },
      { title: 'Add visual feedback', completed: true }
    ]
  },
  {
    title: 'Write documentation',
    description: 'Create comprehensive API and user documentation',
    status: 'todo',
    priority: 'Low',
    labels: ['documentation'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    subtasks: [
      { title: 'API documentation', completed: false },
      { title: 'User guide', completed: false },
      { title: 'Setup instructions', completed: false }
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create boards
    const boards = [];
    for (let i = 0; i < sampleBoards.length; i++) {
      const boardData = {
        ...sampleBoards[i],
        ownerId: users[i % users.length]._id
      };
      const board = new Board(boardData);
      await board.save();
      boards.push(board);
      console.log(`📋 Created board: ${board.title}`);
    }

    // Create tasks
    for (let i = 0; i < sampleTasks.length; i++) {
      const taskData = {
        ...sampleTasks[i],
        boardId: boards[0]._id, // Assign all tasks to first board
        position: i
      };
      const task = new Task(taskData);
      await task.save();
      console.log(`📝 Created task: ${task.title}`);
    }

    // Add some comments to tasks
    const tasks = await Task.find({});
    for (const task of tasks.slice(0, 3)) {
      task.comments.push({
        user: users[0]._id,
        content: 'This looks good, let\'s move forward with this approach.',
        createdAt: new Date()
      });
      await task.save();
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${boards.length} boards, and ${tasks.length} tasks`);
    
    // Display login credentials
    console.log('\n🔑 Login credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
