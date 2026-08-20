const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Render/Railway/etc sit behind a reverse proxy - needed for correct
// protocol/IP detection (e.g. secure cookies, rate limiting by IP).
app.set('trust proxy', 1);

// Middleware
// In production, only allow the configured client origin (same-origin
// deploys where Express also serves the frontend don't strictly need this,
// but it's here for split deployments or a custom domain on the frontend).
app.use(
  cors(
    isProduction
      ? { origin: process.env.CLIENT_URL || true, credentials: true }
      : { origin: true, credentials: true }
  )
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Database Connection
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusSwap API Server Running smoothly 🚀' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/lostfound', require('./routes/lostFoundRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve the React production build (single combined deploy).
// In development, the frontend runs separately via `npm run dev` in
// client/ (Vite dev server), so this block only kicks in when deployed.
if (isProduction) {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Any non-API route falls through to the React app so client-side
  // routing (react-router) works on hard refresh / direct links.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[CampusSwap Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
