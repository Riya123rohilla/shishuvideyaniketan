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
Copy the example file and fill in real values locally:
```bash
cp .env.example .env
```

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
Set your own admin credentials in your local `.env` file.

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
