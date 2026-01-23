# Shishu Vidya Nikethan Backend API

Backend API for the school website with admin panel functionality using Firebase.

## Features
- Event Management (CRUD operations) with Firebase Firestore
- Enquiry Management (View and Update) with Firebase Firestore
- Admin Authentication with JWT
- Firebase Cloud Database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. The Firebase configuration is already included in `config/firebase.js`

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Events
- `GET /api/events` - Get all active events (Public)
- `GET /api/events/all` - Get all events (Admin)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Enquiries
- `POST /api/enquiries` - Submit enquiry (Public)
- `GET /api/enquiries` - Get all enquiries (Admin)
- `GET /api/enquiries/:id` - Get single enquiry (Admin)
- `PUT /api/enquiries/:id` - Update enquiry (Admin)
- `DELETE /api/enquiries/:id` - Delete enquiry (Admin)

## Default Admin Credentials
- Username: admin
- Password: admin123

**Change these in production!**

## Firebase Collections

The system uses the following Firebase Firestore collections:

### events
```
{
  title: string,
  description: string,
  startDate: timestamp,
  endDate: timestamp,
  image: string,
  isActive: boolean,
  priority: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### enquiries
```
{
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  status: 'new' | 'contacted' | 'resolved',
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### admins
```
{
  username: string,
  password: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```
