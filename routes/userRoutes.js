const express = require('express');
const router = express.Router();
const { createUserWithApiKey } = require('../controllers/controllerUser');

router.post('/create', createUserWithApiKey);

module.exports = router;
