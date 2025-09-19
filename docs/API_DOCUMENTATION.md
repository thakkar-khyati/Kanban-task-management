# API Documentation - MERN Stack Kanban Board

## Overview
This document provides comprehensive API documentation for the MERN Stack Kanban Board application. The API is built with Express.js and MongoDB, providing endpoints for user authentication, board management, and task operations.

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

### GET /api/auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "system",
      "language": "en"
    }
  }
}
```

### PUT /api/auth/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

### GET /api/auth/users
Get all users (for member selection).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

---

## Board Endpoints

### GET /api/boards
Get all boards for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title/description
- `archived` (optional): Filter by archived status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "board_id",
      "title": "Project Board",
      "description": "Main project board",
      "ownerId": "user_id",
      "columns": [
        {
          "id": "todo",
          "name": "To Do",
          "order": 0,
          "color": "#6B7280"
        }
      ],
      "members": [
        {
          "user": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "role": "owner",
          "joinedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "taskCount": 5,
      "isArchived": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1
  }
}
```

### GET /api/boards/:id
Get a specific board by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "board_id",
    "title": "Project Board",
    "description": "Main project board",
    "ownerId": "user_id",
    "columns": [...],
    "members": [...],
    "tasks": [...],
    "taskCount": 5,
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/boards
Create a new board.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Board",
  "description": "Board description",
  "columns": [
    {
      "id": "todo",
      "name": "To Do",
      "order": 0,
      "color": "#6B7280"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "board_id",
    "title": "New Board",
    "description": "Board description",
    "ownerId": "user_id",
    "columns": [...],
    "members": [...],
    "taskCount": 0,
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/boards/:id
Update a board.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Board",
  "description": "Updated description"
}
```

### DELETE /api/boards/:id
Delete a board.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Board deleted successfully"
}
```

### POST /api/boards/:id/archive
Toggle board archive status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Board archived successfully"
}
```

### PUT /api/boards/:id/columns
Update board columns.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "columns": [
    {
      "id": "todo",
      "name": "To Do",
      "order": 0,
      "color": "#6B7280"
    },
    {
      "id": "in-progress",
      "name": "In Progress",
      "order": 1,
      "color": "#3B82F6"
    }
  ]
}
```

---

## Board Member Management

### GET /api/boards/:id/members
Get board members.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "role": "owner",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "userRole": "owner"
  }
}
```

### POST /api/boards/:id/members
Add a member to the board.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "member"
}
```

### DELETE /api/boards/:id/members/:userId
Remove a member from the board.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

### PUT /api/boards/:id/members/:userId/role
Update member role.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "admin"
}
```

---

## Task Endpoints

### GET /api/tasks
Get tasks with optional filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `boardId` (required): Board ID
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `assignee` (optional): Filter by assignee ID
- `labels` (optional): Filter by labels (comma-separated)
- `search` (optional): Search in title/description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_id",
      "title": "Task Title",
      "description": "Task description",
      "boardId": "board_id",
      "status": "todo",
      "priority": "Medium",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "labels": ["urgent", "frontend"],
      "assignee": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "position": 0,
      "subtasks": [
        {
          "title": "Subtask 1",
          "completed": false,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "comments": [
        {
          "user": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "content": "Comment text",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "isArchived": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1
  }
}
```

### GET /api/tasks/:id
Get a specific task by ID.

**Headers:** `Authorization: Bearer <token>`

### POST /api/tasks
Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "boardId": "board_id",
  "status": "todo",
  "priority": "Medium",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "labels": ["urgent"],
  "assignee": "user_id"
}
```

### PUT /api/tasks/:id
Update a task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "High",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "labels": ["urgent", "backend"]
}
```

### DELETE /api/tasks/:id
Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### PUT /api/tasks/:id/move
Move a task to a new position/status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "in-progress",
  "position": 1
}
```

### POST /api/tasks/:id/subtasks
Add a subtask to a task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Subtask"
}
```

### PUT /api/tasks/:id/subtasks/:subtaskIndex
Toggle subtask completion.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Subtask updated successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting
- **Authentication endpoints**: 5 requests per minute per IP
- **Other endpoints**: 100 requests per minute per IP

## CORS
The API supports CORS for the following origins:
- `http://localhost:3000` (development)
- `https://your-frontend-domain.com` (production)

## Data Validation
All input data is validated using express-validator with the following rules:
- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Name**: 2-50 characters
- **Title**: 1-100 characters
- **Description**: Maximum 500 characters for boards, 2000 for tasks
- **Priority**: Must be one of: Low, Medium, High, Critical

## Pagination
List endpoints support pagination with the following parameters:
- `page`: Page number (starts from 1)
- `limit`: Number of items per page (max 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

## Timestamps
All timestamps are in ISO 8601 format (UTC):
- `createdAt`: When the resource was created
- `updatedAt`: When the resource was last updated
- `joinedAt`: When a user joined a board
- `dueDate`: Task due date
