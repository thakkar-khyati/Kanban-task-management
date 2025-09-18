# MERN Stack Kanban Board

A modern, collaborative Kanban board application built with MongoDB, Express.js, React, and Node.js. Features drag-and-drop functionality, multi-user collaboration, role-based permissions, and real-time task management.

![Kanban Board](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Kanban+Board+Preview)

## ✨ Features

### Core Functionality
- **Full CRUD Operations** - Create, read, update, and delete boards and tasks
- **Drag & Drop** - Intuitive task movement between columns using react-beautiful-dnd
- **Real-time Updates** - Changes sync immediately across the application
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Multi-User Collaboration
- **Board Sharing** - Invite multiple users to collaborate on boards
- **Role-Based Permissions** - Owner, Admin, Member, and Viewer roles with different access levels
- **User Invitations** - Email-based invitation system with secure tokens
- **Member Management** - Add, remove, and manage board members through intuitive UI
- **Task Assignment** - Assign tasks to specific team members with clear ownership

### User Experience
- **Dark/Light Mode** - Toggle between themes with system preference detection
- **Modern UI** - Clean, Kanban-style interface built with TailwindCSS
- **Task Management** - Priority levels, due dates, labels, subtasks, and assignees
- **Search & Filter** - Find tasks quickly with advanced filtering options
- **Collaborative Features** - Visual indicators for user roles and task ownership

### User Roles & Permissions
- **Owner** - Full control over the board (create, edit, delete, manage members)
- **Admin** - Can invite users and manage members, full board access
- **Member** - Can create and edit tasks, view all board content
- **Viewer** - Read-only access to board and tasks

### Technical Features
- **JWT Authentication** - Secure user authentication and authorization
- **RESTful API** - Well-structured backend API with proper error handling
- **MongoDB Integration** - Efficient data storage with Mongoose ODM
- **Input Validation** - Comprehensive validation on both client and server
- **Error Handling** - Graceful error handling with user-friendly messages
- **Role-Based Security** - Granular permissions enforced at API and UI levels

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kanban-task-management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kanban-board
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (create `frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Kanban Board
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Seed the database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
Kanban-task-management/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration files
│   ├── seeds/              # Database seeders
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API services
│   │   ├── pages/          # Page components
│   │   └── styles/         # Styling files
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

## 🎯 Usage

### Getting Started

1. **Register/Login** - Create a new account or use demo credentials:
   - Email: `john@example.com`
   - Password: `password123`

2. **Create a Board** - Click "New Board" to create your first Kanban board

3. **Add Tasks** - Click "Add a task" in any column to create new tasks

4. **Drag & Drop** - Move tasks between columns by dragging them

5. **Edit Tasks** - Click on any task to edit its details

### Features Guide

#### Boards
- Create multiple boards for different projects
- Archive boards you no longer need
- Customize column names and colors
- Export board data as JSON

#### Tasks
- Add detailed task descriptions
- Set priority levels (Low, Medium, High, Critical)
- Add due dates and labels
- Create subtasks for complex work items
- Assign tasks to team members

#### Columns
- Default columns: To Do, In Progress, Done
- Add custom columns for your workflow
- Reorder columns by dragging
- Customize column colors

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get single board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/move` - Move task

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Seed database with sample data
npm test         # Run tests
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Schema

#### Users
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  preferences: {
    theme: String,
    language: String
  }
}
```

#### Boards
```javascript
{
  title: String,
  description: String,
  ownerId: ObjectId (ref: User),
  columns: [{
    id: String,
    name: String,
    order: Number,
    color: String
  }]
}
```

#### Tasks
```javascript
{
  title: String,
  description: String,
  boardId: ObjectId (ref: Board),
  status: String,
  priority: String,
  dueDate: Date,
  labels: [String],
  subtasks: [{
    title: String,
    completed: Boolean
  }]
}
```

## 🎨 Customization

### Themes
The application supports both light and dark themes. Users can:
- Toggle between themes manually
- Use system preference detection
- Persist theme choice in localStorage

### Styling
Built with TailwindCSS for easy customization:
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for custom styles
- Use CSS variables for consistent theming

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with PM2: `pm2 start server.js`
4. Configure reverse proxy (nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist` folder to your hosting service
3. Configure environment variables

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) for drag-and-drop functionality
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
- [Date-fns](https://date-fns.org/) for date manipulation

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy task managing! 🎉**