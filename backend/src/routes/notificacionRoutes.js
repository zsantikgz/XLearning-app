const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// CREAR NOTIFICACION
router.post('/', authenticateJWT, notificacionController.crearNotificacion);

// OBTENER NOTIFICACIONES
router.get('/:idUsuario', authenticateJWT, notificacionController.obtenerNotificacionesPorUsuario);


router.get('/', authenticateJWT, notificacionController.obtenerTodasNotificaciones);

module.exports = router;
