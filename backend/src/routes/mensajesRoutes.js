const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/mensajesController');

// POST - Enviar mensaje
router.post('/', mensajesController.enviarMensaje);

// GET - Obtener conversación entre dos usuarios
router.get('/:id1/:id2', mensajesController.obtenerConversacion);

// DELETE - Eliminar un mensaje específico
router.delete('/:id1/:id2/:idMensaje', mensajesController.eliminarMensaje);

// PUT - Editar texto
// router.put('/:id1/:id2/:idMensaje', mensajesController.editarMensaje);

// PUT - Marcar como leído
// router.put('/:id1/:id2/:idMensaje/leido', mensajesController.marcarMensajeLeido);


module.exports = router;
