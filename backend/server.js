const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Try to load Firebase (non-blocking)
let db, auth;
try {
  const firebase = require('./config/firebase');
  db = firebase.db;
  auth = firebase.auth;
  console.log('Firebase loaded successfully');
} catch (error) {
  console.log('Firebase loading failed, will use fallback methods');
}

// Initialize Express app
const app = express();

// Initialize Firebase
console.log('Initializing Firebase...');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Shishu Vidya Nikethan API Server' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
