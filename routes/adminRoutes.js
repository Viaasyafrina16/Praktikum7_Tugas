const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getAllApiKeys, deleteUser, deleteApiKey,checkApiKey } = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Register & Login
router.post('/register', register);
router.post('/login', login);

// Get all
router.get('/users', verifyToken, getAllUsers);
router.get('/apikeys', verifyToken, getAllApiKeys);

// Delete user & API key
router.delete('/users/:id', verifyToken, deleteUser);
router.delete('/apikeys/:id', verifyToken, deleteApiKey);

// Endpoint untuk cek apakah API key sudah dipakai
router.get('/apikeys/check/:apiKey', checkApiKey);


module.exports = router;
