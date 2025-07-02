// routes/notificacionPushRoutes.js
const express = require('express');
const router = express.Router();
const { enviarNotificacionExpo } = require('../controllers/notificacionPushController');

router.post('/push', enviarNotificacionExpo);

module.exports = router;
