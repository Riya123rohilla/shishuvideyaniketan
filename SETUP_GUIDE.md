# Local Development Setup Guide

## Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
The `.env` file has been created with the following credentials:
- **ADMIN_USERNAME**: admin
- **ADMIN_PASSWORD**: admin123
- **PORT**: 5000
- **NODE_ENV**: development

You can modify these values in `backend/.env` as needed.

### 3. Start the Backend Server
```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

You should see output like:
```
Server running on port 5000
Initializing Firebase...
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
The `.env.local` file has been created with:
- **REACT_APP_API_URL**: http://localhost:5000/api

This automatically points to your local backend server.

### 3. Start the Frontend Server
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

---

## Running Both Servers

### Option 1: Two Terminal Windows
1. **Terminal 1** - Backend:
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend
   npm start
   ```

### Option 2: Using npm-run-all (Concurrent)
Install globally (optional):
```bash
npm install -g npm-run-all
```

Then run from root directory:
```bash
npm install -g npm-run-all
npm-run-all -p backend:dev frontend:start
```

---

## API Endpoints

Once both servers are running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Login**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `admin123`

### Available API Routes
- `POST /api/auth/login` - Admin login
- `POST /api/auth/change-password` - Change admin password
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin only)
- `GET /api/enquiries` - Get all enquiries
- `POST /api/enquiries` - Create enquiry

---

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change the PORT in `backend/.env`:
```
PORT=5001
```
And update the frontend `.env.local`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

### CORS Issues
The backend CORS is configured for `http://localhost:3000`. If using a different port, update `backend/.env`:
```
CORS_ORIGIN=http://localhost:YOUR_PORT
```

### Firebase Connection Issues
Firebase configuration is optional for local development. The app will continue to run even if Firebase is not configured.

---

## .env Files Reference

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Admin password
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Frontend URL for CORS

### Frontend (.env.local)
- `REACT_APP_API_URL` - Backend API URL

---

## Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build` folder.

---

## Additional Notes

- Never commit `.env` files to version control
- `.env.example` files are provided as templates
- Always use strong passwords in production
- Change `JWT_SECRET` before deploying to production
