const express = require('express');
const router = express.Router();
const { createApiKey, deleteApiKey } = require('../controllers/apiKeyController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createApiKey);
router.delete('/:id', verifyToken, deleteApiKey);

module.exports = router;
