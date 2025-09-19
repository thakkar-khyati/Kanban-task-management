# 🚀 Vercel Deployment Guide - MERN Stack Kanban Board

This comprehensive guide will walk you through deploying your MERN Stack Kanban Board application to Vercel, including both frontend and backend deployment.

## 📋 Table of Contents

1. [Prerequisites Setup](#prerequisites-setup)
2. [Project Structure Changes](#project-structure-changes)
3. [Configuration Files](#configuration-files)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Environment Variables](#environment-variables)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Final Checklist](#final-checklist)

---

## ��️ Prerequisites Setup

### 1. GitHub Repository Setup

Ensure your code is properly committed and pushed to GitHub:

```bash
# Make sure your code is in a GitHub repository
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. MongoDB Atlas Setup (Free)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Choose the free tier (M0 Sandbox)

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select a cloud provider and region
   - Name your cluster (e.g., "kanban-cluster")

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `kanban-user`
   - Password: `your-secure-password` (save this!)
   - Database User Privileges: "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to "Network Access" → "Add IP Address"
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IPs or Vercel's IP ranges

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://kanban-user:your-password@cluster0.xxxxx.mongodb.net/kanban-board?retryWrites=true&w=majority
   ```

### 3. Vercel Account Setup

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Connect your GitHub account

2. **Install Vercel CLI (Optional)**
   ```bash
   npm i -g vercel
   ```

---

## 📁 Project Structure Changes

Your project structure should look like this:



---

## ⚙️ Configuration Files

### 1. Root `vercel.json`

Create this file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Frontend `vercel.json`

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 3. Backend `vercel.json`

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 4. Update Frontend Environment

Update `frontend/.env.example`:

```env
VITE_API_URL=https://your-app-name.vercel.app/api
VITE_APP_NAME=Kanban Board
```

### 5. Update Vite Configuration

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    host: true
  }
})
```

### 6. Update Backend Server

Update `backend/server.js` to work with Vercel:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth');
const boardRoutes = require('./src/routes/boards');
const taskRoutes = require('./src/routes/tasks');
const exportRoutes = require('./src/routes/export');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://your-app-name.vercel.app',
  credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/export', exportRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Kanban Board API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/change-password': 'Change password',
        'POST /api/auth/logout': 'Logout user'
      },
      boards: {
        'GET /api/boards': 'Get all boards',
        'GET /api/boards/:id': 'Get single board',
        'POST /api/boards': 'Create new board',
        'PUT /api/boards/:id': 'Update board',
        'DELETE /api/boards/:id': 'Delete board',
        'PATCH /api/boards/:id/archive': 'Archive/unarchive board',
        'PUT /api/boards/:id/columns': 'Update column order'
      },
      tasks: {
        'GET /api/tasks': 'Get all tasks',
        'GET /api/tasks/:id': 'Get single task',
        'POST /api/tasks': 'Create new task',
        'PUT /api/tasks/:id': 'Update task',
        'DELETE /api/tasks/:id': 'Delete task',
        'PUT /api/tasks/:id/move': 'Move task',
        'POST /api/tasks/:id/subtasks': 'Add subtask',
        'PATCH /api/tasks/:id/subtasks/:index': 'Toggle subtask'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// For Vercel
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

---

## �� Step-by-Step Deployment

### Step 1: Prepare Your Repository

```bash
# Create all the configuration files above
# Then commit and push
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [Vercel.com](https://vercel.com)
   - Click "New Project"

2. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? kanban-board
# - Directory? ./
# - Override settings? No
```

### Step 3: Configure Environment Variables

In your Vercel dashboard:

1. **Go to Project Settings**
   - Click on your project
   - Go to "Settings" → "Environment Variables"

2. **Add Environment Variables**
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://kanban-user:your-password@cluster0.xxxxx.mongodb.net/kanban-board?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE = 7d
   BCRYPT_ROUNDS = 12
   CORS_ORIGIN = https://your-app-name.vercel.app
   CORS_CREDENTIALS = true
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   VITE_API_URL = https://your-app-name.vercel.app/api
   ```

3. **Redeploy**
   - After adding environment variables, redeploy your project
   - Go to "Deployments" → "Redeploy"

---

## �� Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://your-app.vercel.app` |
| `CORS_CREDENTIALS` | Allow credentials in CORS | `true` |
| `VITE_API_URL` | Frontend API URL | `https://your-app.vercel.app/api` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

---

## �� Testing Your Deployment

### 1. Frontend Testing

Visit your Vercel URL:
- **Main App**: `https://your-app-name.vercel.app`
- **Should see**: Your Kanban board interface

### 2. Backend API Testing

Test these endpoints:
- **Health Check**: `https://your-app-name.vercel.app/health`
- **API Documentation**: `https://your-app-name.vercel.app/api`
- **Auth Endpoint**: `https://your-app-name.vercel.app/api/auth/register`

### 3. Database Connection Testing

1. **Register a new user** through the frontend
2. **Check MongoDB Atlas** to see if the user was created
3. **Create a board** and verify it appears in the database

### 4. Full Functionality Testing

- [ ] User registration and login
- [ ] Board creation and management
- [ ] Task creation and drag-and-drop
- [ ] Member management
- [ ] Data export functionality

---

## �� Troubleshooting

### Common Issues and Solutions

#### Issue 1: Build Fails

**Symptoms**: Deployment fails during build process

**Solutions**:
```bash
# Test build locally
cd frontend
npm run build

# Check for errors
npm run lint

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue 2: API Routes Not Working

**Symptoms**: Frontend can't connect to backend API

**Solutions**:
- Check `vercel.json` routes configuration
- Verify backend code is in correct location
- Ensure environment variables are set
- Check CORS configuration

#### Issue 3: Database Connection Issues

**Symptoms**: API returns database connection errors

**Solutions**:
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes Vercel's IPs
- Ensure database user has correct permissions
- Test connection string locally

#### Issue 4: CORS Errors

**Symptoms**: Browser shows CORS policy errors

**Solutions**:
- Update `CORS_ORIGIN` to your Vercel domain
- Check that frontend is calling correct API URL
- Verify `CORS_CREDENTIALS` is set to `true`

#### Issue 5: Environment Variables Not Loading

**Symptoms**: App uses default values instead of environment variables

**Solutions**:
- Check variable names are correct
- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check for typos in variable names

### Debugging Steps

1. **Check Vercel Logs**
   - Go to "Functions" tab in Vercel dashboard
   - Check function logs for errors

2. **Test API Endpoints**
   - Use Postman or curl to test API directly
   - Check response headers and status codes

3. **Verify Environment Variables**
   - Check Vercel dashboard for correct values
   - Use `console.log(process.env.VARIABLE_NAME)` to debug

4. **Check Network Tab**
   - Open browser dev tools
   - Check Network tab for failed requests
   - Look for CORS or 404 errors

---

## ✅ Final Checklist

Before considering your deployment complete, verify:

### Pre-Deployment Checklist
- [ ] GitHub repository is up to date
- [ ] All configuration files are created
- [ ] MongoDB Atlas cluster is accessible
- [ ] Environment variables are prepared
- [ ] Frontend builds successfully locally
- [ ] Backend runs successfully locally

### Post-Deployment Checklist
- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at `/api` endpoint
- [ ] Health check endpoint works
- [ ] Database connection is established
- [ ] User registration works
- [ ] Board creation works
- [ ] Task management works
- [ ] Drag-and-drop functionality works
- [ ] Member management works
- [ ] Export functionality works
- [ ] CORS is configured correctly
- [ ] All environment variables are set

### Performance Checklist
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] No console errors in browser
- [ ] Mobile responsiveness works
- [ ] Dark mode works correctly

---

## 🎉 Success!

Once you've completed all the steps and checked all items on the checklist, your MERN Stack Kanban Board will be:

- ✅ **Live on Vercel** with global CDN
- ✅ **Fully functional** with all features working
- ✅ **Secure** with proper authentication and CORS
- ✅ **Scalable** with serverless architecture
- ✅ **Fast** with optimized builds and caching
- ✅ **Professional** with custom domain support

## 📞 Support

If you encounter any issues not covered in this guide:

1. **Check Vercel Documentation**: [Vercel Docs](https://vercel.com/docs)
2. **Check MongoDB Atlas Documentation**: [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
3. **Review Error Logs**: Check Vercel function logs
4. **Test Locally**: Ensure everything works in development
5. **Create GitHub Issue**: If problems persist

---

**Happy Deploying! 🚀**

*This guide was created specifically for the MERN Stack Kanban Board project. For questions or updates, please refer to the project repository.*