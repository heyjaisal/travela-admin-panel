

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const createRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const graphRoutes = require('./routes/graphs.routes');
const listingRoutes = require('./routes/listing.routes');

const app = express();
app.set('trust proxy', 1); 

const allowedOrigins = [
  'http://localhost:5174',
  'https://admin.jaisal.blog',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[DB] ✅ Connected to MongoDB'))
  .catch(err => {
    console.error('[DB] ❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.use('/api/admin', createRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/graphs', graphRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`[Server] 🚀 Admin server running on port ${PORT}`);
});
