const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Subir entrega
router.post('/', authenticateJWT, entregaController.subirEntrega);

// Obtener todas las entregas
router.get('/', authenticateJWT, entregaController.obtenerTodasEntregas);

// Obtener entregas por estudiante
router.get('/estudiante/:idEstudiante', authenticateJWT, entregaController.obtenerPorEstudiante);

// Obtener entregas por asignación
router.get('/asignacion/:idAsignacion', authenticateJWT, entregaController.obtenerPorAsignacion);

// Eliminar entrega (opcional)
router.delete('/:id', authenticateJWT, entregaController.eliminarEntrega);

// Actualizar URL de entrega
router.put('/:id', authenticateJWT, entregaController.actualizarUrlEntrega);

module.exports = router;
