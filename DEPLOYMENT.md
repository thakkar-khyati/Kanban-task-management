# 🚀 Deployment Guide - MERN Stack Kanban Board

This guide covers various deployment options for the MERN Stack Kanban Board application.

## 📋 Prerequisites

- Node.js 18.0 or higher
- MongoDB 6.0 or higher
- Docker and Docker Compose (for containerized deployment)
- Git

## 🐳 Docker Deployment (Recommended)

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   ```

2. **Deploy with Docker Compose**
   ```bash
   ./deploy.sh docker
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Manual Docker Deployment

1. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

## 🌐 Production Deployment

### Option 1: Traditional Server Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   
   # Deploy
   ./deploy.sh production
   ```

3. **Configure Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Cloud Platform Deployment

#### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   heroku create your-app-name-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   git push heroku main
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   heroku create your-app-name-frontend
   heroku config:set VITE_API_URL=https://your-app-name-backend.herokuapp.com/api
   git push heroku main
   ```

#### Vercel Deployment (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - `VITE_API_URL`: Your backend API URL

#### Railway Deployment

1. **Connect GitHub Repository**
   - Go to Railway.app
   - Connect your GitHub repository
   - Select the project

2. **Configure Services**
   - Backend: Set root directory to `backend`
   - Frontend: Set root directory to `frontend`
   - Database: Add MongoDB service

3. **Set Environment Variables**
   - Backend: All variables from `env.production`
   - Frontend: `VITE_API_URL`

## 🔧 Environment Configuration

### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-board-prod
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-frontend-domain.com
CORS_CREDENTIALS=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Kanban Board
```

## 🛡️ Security Considerations

### Production Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Monitor logs for suspicious activity

### SSL Certificate Setup

1. **Using Let's Encrypt (Certbot)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Using Cloudflare**
   - Add domain to Cloudflare
   - Enable SSL/TLS encryption
   - Set SSL mode to "Full (strict)"

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks**
   - Backend: `GET /health`
   - Frontend: `GET /health`

2. **Log Monitoring**
   ```bash
   # Docker logs
   docker-compose logs -f backend
   docker-compose logs -f frontend
   
   # System logs
   journalctl -u your-app-service -f
   ```

3. **Performance Monitoring**
   - Use tools like PM2 for process management
   - Set up monitoring with tools like New Relic or DataDog

### Database Monitoring

1. **MongoDB Monitoring**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # View MongoDB logs
   tail -f /var/log/mongodb/mongod.log
   ```

2. **Database Backup**
   ```bash
   # Create backup
   mongodump --db kanban-board --out /backup/kanban-board-$(date +%Y%m%d)
   
   # Restore backup
   mongorestore --db kanban-board /backup/kanban-board-20240115/kanban-board
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
        
    - name: Run tests
      run: |
        cd backend && npm test
        
    - name: Build frontend
      run: |
        cd frontend && npm run build
        
    - name: Deploy to server
      run: |
        # Add your deployment commands here
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   sudo lsof -i :5000
   
   # Kill process
   sudo kill -9 PID
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

3. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Docker Issues**
   ```bash
   # Clean up Docker
   docker system prune -a
   
   # Rebuild containers
   docker-compose up -d --build --force-recreate
   ```

### Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.boards.createIndex({ "ownerId": 1, "isArchived": 1 })
   db.tasks.createIndex({ "boardId": 1, "status": 1 })
   ```

2. **Caching**
   - Implement Redis for session storage
   - Use CDN for static assets
   - Enable browser caching

3. **Load Balancing**
   - Use multiple backend instances
   - Implement sticky sessions
   - Configure health checks

## 📞 Support

If you encounter issues during deployment:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity and firewall settings
5. Review the troubleshooting section above

For additional help, please create an issue in the GitHub repository.

---

**Happy Deploying! 🚀**
