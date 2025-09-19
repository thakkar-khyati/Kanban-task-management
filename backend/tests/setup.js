const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.BCRYPT_ROUNDS = '4'; // Lower rounds for faster tests

// Global test setup
beforeAll(async () => {
  // Connect to test database
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

// Clean up after each test
afterEach(async () => {
  // Clean up all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Increase timeout for database operations
jest.setTimeout(10000);
