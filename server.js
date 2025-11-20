const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <- tambahkan

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve file HTML

// API Routes
app.use('/users', userRoutes);
app.use('/admin', adminRoutes); // <- tambahkan

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
