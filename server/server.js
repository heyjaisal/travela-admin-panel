const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const path = require('path')
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI,{
})

  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api', authRoutes); 
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
