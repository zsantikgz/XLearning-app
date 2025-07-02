const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear anuncio
router.post('/', authenticateJWT, anuncioController.crearAnuncio);

// Obtener todos los anuncios
router.get('/', authenticateJWT, anuncioController.obtenerTodosAnuncios);

// Obtener anuncios por clase
router.get('/clase/:idClase', authenticateJWT, anuncioController.obtenerAnunciosPorClase);

// Editar anuncio 
router.put('/:id', authenticateJWT, anuncioController.editarAnuncio);

// Eliminar anuncio 
router.delete('/:id', authenticateJWT, anuncioController.eliminarAnuncio);

module.exports = router;
