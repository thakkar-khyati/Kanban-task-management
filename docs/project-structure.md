# MERN Stack Kanban Board - Project Structure

## Overview
This document outlines the recommended project structure for the MERN stack Kanban Board application with multi-user collaboration features.

## Root Directory Structure
```
Kanban-task-management/
├── backend/                 # Node.js/Express backend
├── frontend/               # React frontend
├── docs/                   # Project documentation
├── roadmap.json           # Project roadmap and milestones
└── README.md              # Main project documentation
```

## Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   └── taskController.js
│   ├── models/            # MongoDB/Mongoose models
│   │   ├── User.js
│   │   ├── Board.js
│   │   └── Task.js
│   ├── routes/            # Express routes
│   │   ├── auth.js
│   │   ├── boards.js
│   │   └── tasks.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/             # Utility functions
│   │   ├── database.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── config/            # Configuration files
│   │   ├── database.js
│   │   └── jwt.js
│   └── app.js             # Express app setup
├── tests/                 # Backend tests
│   ├── unit/
│   └── integration/
├── seeds/                 # Database seeders
│   └── seedData.js
├── package.json
├── .env.example
└── server.js              # Entry point
```

## Frontend Structure (`/frontend`)
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── board/         # Board-related components
│   │   │   ├── Board.jsx
│   │   │   ├── BoardHeader.jsx
│   │   │   └── BoardList.jsx
│   │   ├── column/        # Column components
│   │   │   ├── Column.jsx
│   │   │   ├── ColumnHeader.jsx
│   │   │   └── AddColumn.jsx
│   │   ├── task/          # Task components
│   │   │   ├── Task.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── auth/          # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AuthWrapper.jsx
│   │   └── layout/        # Layout components
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Layout.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useBoards.js
│   │   ├── useTasks.js
│   │   └── useDragAndDrop.js
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── BoardContext.js
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── boardService.js
│   │   └── taskService.js
│   ├── utils/             # Utility functions
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   ├── styles/            # Styling files
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── BoardPage.jsx
│   │   └── LoginPage.jsx
│   ├── App.jsx            # Main App component
│   └── index.js           # Entry point
├── tests/                 # Frontend tests
│   ├── components/
│   └── pages/
├── package.json
└── tailwind.config.js
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Boards Collection
```javascript
{
  _id: ObjectId,
  title: String,
  ownerId: ObjectId (ref: User),
  columns: [{
    id: String,
    name: String,
    order: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  boardId: ObjectId (ref: Board),
  title: String,
  description: String,
  status: String, // column name
  priority: String, // 'High', 'Medium', 'Low'
  dueDate: Date,
  labels: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - Get all boards for user
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get specific board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks?boardId=:id` - Get tasks for board
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Columns
- `PUT /api/boards/:id/columns` - Update column order/names

## Key Technologies & Dependencies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **react-beautiful-dnd** - Drag and drop
- **TailwindCSS** - CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Date-fns** - Date manipulation
- **React Query** - Data fetching and caching

## Multi-User Collaboration Features

### Board Sharing & Access Control
- **Multi-User Boards**: Boards can be shared with multiple users
- **Role-Based Permissions**: Four distinct user roles with different access levels
- **Invitation System**: Email-based invitations with secure tokens
- **Member Management**: Add, remove, and manage board members

### User Roles & Permissions
- **Owner**: Full control over the board (create, edit, delete, manage members)
- **Admin**: Can invite users and manage members, full board access
- **Member**: Can create and edit tasks, view all board content
- **Viewer**: Read-only access to board and tasks

### Task Assignment
- **User Assignment**: Tasks can be assigned to specific board members
- **Assignee Selection**: Dropdown showing all board members with their roles
- **Assignment Display**: Clear indication of task ownership and responsibility

### Collaboration UI Components
- **BoardMembersModal**: Manage board members and invitations
- **User Selection**: Task assignment with member dropdown
- **Role Indicators**: Visual indicators for user roles and permissions
- **Invitation Management**: Send, accept, and decline board invitations

## Development Workflow

1. **Setup Phase**
   - Initialize backend and frontend projects
   - Set up database connection
   - Configure development environment

2. **Backend Development**
   - Create database models
   - Implement API endpoints
   - Add authentication middleware
   - Write tests

3. **Frontend Development**
   - Create component structure
   - Implement API integration
   - Add drag and drop functionality
   - Implement responsive design

4. **Integration & Testing**
   - Connect frontend to backend
   - Test all functionality
   - Fix bugs and optimize performance

5. **Deployment**
   - Set up production environment
   - Deploy backend and frontend
   - Configure domain and SSL

## File Naming Conventions

- **Components**: PascalCase (e.g., `TaskCard.jsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useTasks.js`)
- **Services**: camelCase (e.g., `taskService.js`)
- **Utils**: camelCase (e.g., `helpers.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Kanban Board
```

This structure provides a solid foundation for building a scalable and maintainable MERN stack Kanban Board application.
