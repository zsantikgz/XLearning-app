const express = require('express'); 
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear Chat
router.post('/crear-chat', authenticateJWT, mensajeController.crearChat);

// Crear Mensaje en Chat Específico
router.post('/:chatId', authenticateJWT, mensajeController.crearMensaje);

// Leer Mensajes de Chat Específico
router.get('/:chatId', authenticateJWT, mensajeController.obtenerMensajes);

module.exports = router;
