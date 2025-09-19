const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Board = require('../src/models/Board');
const mongoose = require('mongoose');

describe('Board Endpoints', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await Board.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
    await Board.deleteMany({});

    // Create a test user and get auth token
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  describe('POST /api/boards', () => {
    it('should create a new board successfully', async () => {
      const boardData = {
        title: 'Test Board',
        description: 'Test board description',
        columns: [
          {
            id: 'todo',
            name: 'To Do',
            order: 0,
            color: '#6B7280'
          },
          {
            id: 'in-progress',
            name: 'In Progress',
            order: 1,
            color: '#3B82F6'
          }
        ]
      };

      const response = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(boardData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(boardData.title);
      expect(response.body.data.description).toBe(boardData.description);
      expect(response.body.data.ownerId).toBe(userId);
      expect(response.body.data.columns).toHaveLength(2);
      expect(response.body.data.members).toHaveLength(1); // Owner is automatically added
    });

    it('should not create board without authentication', async () => {
      const boardData = {
        title: 'Test Board',
        description: 'Test board description'
      };

      const response = await request(app)
        .post('/api/boards')
        .send(boardData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/boards', () => {
    beforeEach(async () => {
      // Create test boards
      const boards = [
        {
          title: 'Board 1',
          description: 'First board',
          ownerId: userId,
          columns: [
            { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' }
          ]
        },
        {
          title: 'Board 2',
          description: 'Second board',
          ownerId: userId,
          columns: [
            { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' }
          ]
        }
      ];

      for (const board of boards) {
        await new Board(board).save();
      }
    });

    it('should get all boards for authenticated user', async () => {
      const response = await request(app)
        .get('/api/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should not get boards without authentication', async () => {
      const response = await request(app)
        .get('/api/boards')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/boards?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.current).toBe(1);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/boards?search=Board 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Board 1');
    });
  });

  describe('GET /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const board = new Board({
        title: 'Test Board',
        description: 'Test board description',
        ownerId: userId,
        columns: [
          { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' }
        ]
      });

      const savedBoard = await board.save();
      boardId = savedBoard._id;
    });

    it('should get a specific board by ID', async () => {
      const response = await request(app)
        .get(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Board');
      expect(response.body.data.ownerId).toBe(userId);
    });

    it('should not get board without authentication', async () => {
      const response = await request(app)
        .get(`/api/boards/${boardId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent board', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/boards/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const board = new Board({
        title: 'Test Board',
        description: 'Test board description',
        ownerId: userId,
        columns: [
          { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' }
        ]
      });

      const savedBoard = await board.save();
      boardId = savedBoard._id;
    });

    it('should update board successfully', async () => {
      const updateData = {
        title: 'Updated Board',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Board');
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should not update board without authentication', async () => {
      const updateData = {
        title: 'Updated Board'
      };

      const response = await request(app)
        .put(`/api/boards/${boardId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/boards/:id', () => {
    let boardId;

    beforeEach(async () => {
      const board = new Board({
        title: 'Test Board',
        description: 'Test board description',
        ownerId: userId,
        columns: [
          { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' }
        ]
      });

      const savedBoard = await board.save();
      boardId = savedBoard._id;
    });

    it('should delete board successfully', async () => {
      const response = await request(app)
        .delete(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify board is deleted
      const getResponse = await request(app)
        .get(`/api/boards/${boardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    it('should not delete board without authentication', async () => {
      const response = await request(app)
        .delete(`/api/boards/${boardId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
