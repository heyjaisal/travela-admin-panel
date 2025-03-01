const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createRoutes = require('./routes/admin.routes');
const authRoutes = require("./routes/auth.routes")
const path = require('path')
require('dotenv').config();
const cookieParser = require("cookie-parser");


const app = express();

mongoose.connect(process.env.MONGO_URI,{
})

  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/admin', createRoutes); 
app.use('/api/admin/auth',authRoutes)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
