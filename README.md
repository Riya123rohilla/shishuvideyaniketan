# Shishu Vidya Nikethan - School Website

A modern, full-stack school website with admin panel for event management and enquiry handling.

## Features

### Public Website
- 🎓 Modern, responsive school website
- 🌍 Multi-language support (English & Hindi)
- 📅 Event banner that appears on first visit
- 📋 Events page showing all school events
- 📧 Contact form with backend integration
- 🎨 Consistent design with animations (GSAP, Framer Motion)

### Admin Panel
- 🔐 Secure admin login with JWT authentication
- 📅 **Event Management**
  - Create, edit, delete events
  - Set event priority
  - Toggle event active/inactive status
  - Add event images and descriptions
- 📬 **Enquiry Management**
  - View all enquiries from contact form
  - Update enquiry status (New → Contacted → Resolved)
  - Filter enquiries by status

## Project Structure

```
shishuvideyaniketan/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── locales/       # i18n translations
│   └── package.json
├── backend/           # Node.js Express backend
│   ├── config/        # Database configuration
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   └── server.js      # Entry point
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shishu_vidya_nikethan
JWT_SECRET=your_jwt_secret_key_change_this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. Start MongoDB server (if using local MongoDB)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the frontend folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

**⚠️ Change these credentials in production!**

## Usage

### Accessing the Website
Visit `http://localhost:3000` to see the public website.

### Accessing Admin Panel
1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Manage events and view enquiries from the dashboard

### Event Banner
- Shows automatically when users first visit the website
- Can be closed by clicking the X button
- Won't show again for 24 hours (stored in localStorage)
- Only displays active events

### Creating Events
1. Login to admin panel
2. Go to Events tab
3. Click "Add New Event"
4. Fill in event details:
   - Title
   - Description
   - Start Date
   - End Date
   - Image URL (optional)
   - Priority (higher priority shows first)
5. Click "Create Event"

### Managing Enquiries
1. Login to admin panel
2. Go to Enquiries tab
3. View all contact form submissions
4. Update status as you process them:
   - New → Contacted → Resolved

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all active events
- `POST /api/enquiries` - Submit contact form

### Admin Endpoints (require authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/events/all` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/enquiries` - Get all enquiries
- `PUT /api/enquiries/:id` - Update enquiry

## Technologies Used

### Frontend
- React 19
- React Router
- Tailwind CSS
- GSAP (animations)
- Framer Motion
- i18next (internationalization)
- Axios (API calls)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- CORS

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
The backend is production-ready. Just ensure environment variables are properly set.

## Security Notes

- Change default admin credentials before deploying
- Use strong JWT secret in production
- Enable HTTPS in production
- Set proper CORS origins
- Use environment variables for sensitive data

## License

This project is for educational purposes.
