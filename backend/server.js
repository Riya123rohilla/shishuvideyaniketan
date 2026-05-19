const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

console.log('Initializing Server...');

const fs = require('fs');
const SheetService = require('./services/SheetService');

// Middleware
const rawOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
const allowedOrigins = rawOrigins.map(o => o.trim().replace(/\/$/, ""));
console.log('✅ Allowed Origins:', allowedOrigins);

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to avoid breaking existing scripts/images if not configured
  crossOriginEmbedderPolicy: false,
}));

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/$/, "");

    // Check if origin is in allowedOrigins list OR is a vercel deployment of the project
    const isAllowed = allowedOrigins.indexOf(normalizedOrigin) !== -1 ||
      (normalizedOrigin.includes('shishuvideyaniketan') && normalizedOrigin.endsWith('.vercel.app')) ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked: "${origin}" vs Allowed: "${allowedOrigins.join(', ')}"`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));

// Serve React static files in production (only if directory exists)
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));

  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
} else {
  // Simple welcome for API server
  app.get('/', (req, res) => {
    res.json({
      message: 'Shishu Vidya Niketan API Server',
      status: 'running',
      mode: process.env.NODE_ENV || 'development'
    });
  });
}

// ========== AUTOMATIC CLEANUP TASK ==========
// Function to delete expired events
const cleanupExpiredEvents = async () => {
  try {
    const allEvents = await SheetService.getAll('Events');
    const today = new Date();
    let deletedCount = 0;

    for (const event of allEvents) {
      // Check if event has visibility duration set
      if (event.createdAt && event.visibilityDays) {
        const createdDate = new Date(event.createdAt);
        const visibilityExpireDate = new Date(createdDate.getTime() + (event.visibilityDays * 24 * 60 * 60 * 1000));

        // If visibility duration has expired, delete the event
        if (today > visibilityExpireDate) {
          try {
            await SheetService.remove('Events', event._id || event.id);
            deletedCount++;
            console.log(`✅ AUTO-CLEANUP: Deleted expired event "${event.title}"`);
          } catch (error) {
            console.error(`❌ AUTO-CLEANUP: Failed to delete event "${event.title}":`, error.message);
          }
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`📊 AUTO-CLEANUP: Completed. Deleted ${deletedCount} expired events.`);
    }
  } catch (error) {
    console.error('❌ AUTO-CLEANUP ERROR:', error.message);
  }
};

// Run cleanup every 1 hour (3600000 ms)
const CLEANUP_INTERVAL = 3600000; // 1 hour
setInterval(cleanupExpiredEvents, CLEANUP_INTERVAL);
console.log('⏰ Event cleanup scheduled to run every hour');

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;

let server;

try {
  // Render and local need app.listen, Vercel handles it via export
  if (!process.env.VERCEL) {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server fully initialized and listening on port ${PORT}`);
    }).on('error', (err) => {
      console.error('❌ Server failed to start:', err.message);
      process.exit(1);
    });
  } else {
    console.log('☁️ Running in Vercel environment (Serverless)');
  }
} catch (error) {
  console.error('💥 Critical Startup Error:', error);
  process.exit(1);
}

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('SIGTERM/SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
