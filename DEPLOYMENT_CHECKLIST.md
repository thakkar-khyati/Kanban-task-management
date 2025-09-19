# 🚀 Vercel Deployment Checklist - MERN Stack Kanban Board

## ✅ Setup Complete Status

### Configuration Files Created:
- [x] `vercel.json` (root configuration)
- [x] `frontend/vercel.json` (frontend configuration)
- [x] `backend/vercel.json` (backend configuration)
- [x] `backend/server.js` (updated for Vercel)
- [x] `frontend/vite.config.js` (updated for Vercel)
- [x] `frontend/.env.production` (production environment)
- [x] `.env.vercel.template` (environment variables template)

## 🔑 Required Environment Variables & Keys

### 1. MongoDB Atlas Setup
**What you need to do:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string

**Required Value:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban-board?retryWrites=true&w=majority
```

### 2. JWT Secret Key
**What you need to do:**
Generate a strong, random secret key for JWT tokens

**Required Value:**
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**How to generate:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

### 3. Vercel App URL
**What you need to do:**
After deploying to Vercel, you'll get a URL like: `https://your-app-name.vercel.app`

**Required Values:**
```
CORS_ORIGIN=https://your-app-name.vercel.app
VITE_API_URL=https://your-app-name.vercel.app/api
```

## 📋 Complete Environment Variables List

Copy these to your Vercel dashboard under **Settings > Environment Variables**:

### Required Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban-board?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-app-name.vercel.app
CORS_CREDENTIALS=true
VITE_API_URL=https://your-app-name.vercel.app/api
VITE_APP_NAME=Kanban Board
```

### Optional Variables:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Code
```bash
# Commit all changes
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### Step 3: Set Environment Variables
1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add all the variables listed above
4. Replace placeholder values with your actual values

### Step 4: Redeploy
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

## 🧪 Testing Your Deployment

### Test URLs:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend Health**: `https://your-app-name.vercel.app/health`
- **API Documentation**: `https://your-app-name.vercel.app/api`

### Test Checklist:
- [ ] Frontend loads without errors
- [ ] Backend API responds
- [ ] User registration works
- [ ] User login works
- [ ] Board creation works
- [ ] Task management works
- [ ] Drag and drop works
- [ ] Member management works
- [ ] Export functionality works

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Test build locally: `cd frontend && npm run build`

2. **API Not Working**
   - Check environment variables are set
   - Verify CORS_ORIGIN matches your Vercel URL
   - Check Vercel function logs

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

4. **CORS Errors**
   - Update CORS_ORIGIN to your Vercel URL
   - Check VITE_API_URL matches your backend URL

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set correctly
3. Test locally first
4. Check MongoDB Atlas connection

## 🎉 Success!

Once everything is working, your app will be:
- ✅ Live on Vercel with global CDN
- ✅ Fully functional with all features
- ✅ Secure with proper authentication
- ✅ Scalable with serverless architecture
- ✅ Fast with optimized builds

**Your MERN Stack Kanban Board is ready for production! 🚀**
