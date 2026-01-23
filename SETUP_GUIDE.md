# Quick Setup Guide

## ✅ What's Been Done

### Backend (Complete)
- ✅ Node.js Express server created
- ✅ MongoDB models (Event, Enquiry, Admin)
- ✅ API routes for events and enquiries
- ✅ JWT authentication for admin
- ✅ Backend dependencies installed
- ✅ Server running on port 5000

### Frontend (Complete)
- ✅ Event Banner component (shows on first visit)
- ✅ Events Page with filtering
- ✅ Admin Login page
- ✅ Admin Dashboard (manage events & enquiries)
- ✅ Contact form connected to backend
- ✅ Navigation updated with Events link
- ✅ Translations added (English & Hindi)
- ✅ All dependencies installed

## 📋 To Complete Setup

### 1. Install MongoDB

You need MongoDB running locally. Choose one option:

**Option A: MongoDB Community Server (Recommended)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically

**Option B: MongoDB Atlas (Cloud - Free)**
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update backend/.env with your MongoDB Atlas URI

### 2. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

### 3. Test the System

1. **Visit the website**: http://localhost:3000
   - Event banner should appear (if any events exist)
   - Navigate to Events page
   - Fill out contact form

2. **Login to Admin**: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `admin123`

3. **Admin Dashboard**:
   - Create a test event
   - View contact form submissions

## 🎯 Features Overview

### For Users
1. **Event Banner** - Shows automatically on first visit
   - Displays active events
   - Can be closed (won't show again for 24 hours)
   - Multiple events carousel

2. **Events Page** - `/events`
   - View all school events
   - Filter by: All, Upcoming, Past
   - Beautiful cards with dates

3. **Contact Form** - `/contact`
   - Now saves to database
   - Admin can view submissions

### For Admin
1. **Login** - `/admin/login`
   - Secure JWT authentication
   - Default: admin / admin123

2. **Dashboard** - `/admin/dashboard`
   - **Events Tab**:
     - Create new events
     - Edit existing events
     - Delete events
     - Toggle active/inactive
     - Set priority (higher shows first)
   
   - **Enquiries Tab**:
     - View all contact form submissions
     - Update status: New → Contacted → Resolved
     - Filter by status

## 📝 Creating Your First Event

1. Login to admin panel
2. Go to Events tab
3. Click "Add New Event"
4. Fill in:
   - Title: "Annual Sports Day 2024"
   - Description: "Join us for our annual sports day celebration..."
   - Start Date: (Choose a date)
   - End Date: (Choose a date)
   - Image URL: (Optional - Use any image URL like from Unsplash)
   - Priority: 1 (Higher priority shows first)
5. Click "Create Event"
6. Event will now show on the website!

## 🎨 Styling

- All components match your existing blue-900 theme
- Responsive design for mobile/tablet/desktop
- GSAP animations preserved
- Consistent with your current design

## 🔒 Security Notes

⚠️ **Before deploying to production:**
1. Change default admin credentials in backend/.env
2. Use strong JWT secret
3. Enable HTTPS
4. Set proper CORS origins
5. Use environment variables for all sensitive data

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify .env file exists in backend folder

**Frontend errors:**
- Make sure backend is running first
- Check if REACT_APP_API_URL in frontend/.env is correct
- Clear browser cache and restart

**Event banner not showing:**
- Create an event in admin panel first
- Make sure event dates include today
- Clear localStorage: Open browser console → `localStorage.clear()`

## 📚 API Endpoints

### Public
- GET `/api/events` - Get active events
- POST `/api/enquiries` - Submit contact form

### Admin (requires token)
- POST `/api/auth/login` - Login
- GET `/api/events/all` - Get all events
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event
- GET `/api/enquiries` - Get all enquiries
- PUT `/api/enquiries/:id` - Update enquiry

## 🚀 Next Steps

1. Install MongoDB
2. Start both servers
3. Create some events
4. Test the event banner
5. Customize as needed!

Enjoy your new admin panel! 🎉
