const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/registrar
router.post('/registrar', authController.registrar);

// POST /api/auth/login-profesor
router.post('/login-profesor', authController.loginProfesor);

module.exports = router;