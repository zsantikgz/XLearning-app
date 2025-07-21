const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionEstudianteController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear
router.post('/', authenticateJWT, controller.crearNotificacionEstudiante);

// Obtener
router.get('/', authenticateJWT, controller.obtenerTodasNotificacionesEstudiantes);
router.get('/estudiante/:idEstudiante', authenticateJWT, controller.obtenerPorEstudiante);
router.get('/clase/:idClase', authenticateJWT, controller.obtenerPorClase);
router.get('/creador/:idCreador', authenticateJWT, controller.obtenerPorCreador);
router.get('/importancia/:importancia', authenticateJWT, controller.obtenerPorImportancia);

// Editar
router.put('/:id', authenticateJWT, controller.editarNotificacion);
router.put('/leido/:id', authenticateJWT, controller.marcarComoLeida);

// Eliminar
router.delete('/:id', authenticateJWT, controller.eliminarNotificacion);

module.exports = router;
