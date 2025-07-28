const express = require('express');
const router = express.Router();
const felicitacionesController = require('../controllers/felicitacionesController');

// Post Felicitaciones
router.post('/', felicitacionesController.crearFelicitacion);

// GET de todas las Felicitaciones
router.get('/', felicitacionesController.obtenerTodasFelicitaciones);

// GET de Felicitaciones por ID de usuario
router.get('/usuario/:idUsuario', felicitacionesController.obtenerPorUsuario);

// Editar Felicitación
router.put('/:id', felicitacionesController.editarFelicitacion);

// Editar Felicitación por ID de usuario
router.put('/usuario/:idUsuario', felicitacionesController.editarPorUsuario);


module.exports = router;
