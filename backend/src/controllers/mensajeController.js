const db = require('../../firebase/firebase');
const logger = require('../utils/logger');

// Crear Chat
exports.crearChat = async (req, res) => {
    const { usuario1, usuario2 } = req.body;

    if (usuario1 == null || usuario2 == null) {
        return res.status(400).json({ error: 'Se requieren usuario1 y usuario2' });
    }

    const chatId = [Number(usuario1), Number(usuario2)].sort((a, b) => a - b).join('_');

    try {
        const chatRef = db.collection('mensajes').doc(chatId);
        const doc = await chatRef.get();

        if (!doc.exists) {
            await chatRef.set({ participantes: [Number(usuario1), Number(usuario2)] });
            res.status(201).json({ id: chatId, mensaje: 'Chat creado exitosamente' });
        } else {
            res.status(200).json({ id: chatId, mensaje: 'Chat ya existe' });
        }
    } catch (error) {
        logger.error('Error al crear chat:', error);
        res.status(500).json({ error: 'Error al crear chat' });
    }
};

// Crear Mensaje
exports.crearMensaje = async (req, res) => {
    const { chatId } = req.params;
    const { remitente, texto } = req.body;

    if (!remitente || !texto) {
        return res.status(400).json({ error: 'Se requiere remitente y texto' });
    }

    try {
        const ref = await db.collection('mensajes')
            .doc(chatId)
            .collection('mensajes')
            .add({
                remitente: Number(remitente),
                texto,
                fecha: new Date()
            });
        res.status(201).json({ id: ref.id, mensaje: 'Mensaje creado correctamente' });
    } catch (error) {
        logger.error('Error al crear mensaje:', error);
        res.status(500).json({ error: 'Error al crear mensaje' });
    }
};

// Obtener Mensajes
exports.obtenerMensajes = async (req, res) => {
    const { chatId } = req.params;

    try {
        const snapshot = await db.collection('mensajes')
            .doc(chatId)
            .collection('mensajes')
            .orderBy('fecha', 'asc')
            .get();

        const mensajes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(mensajes);
    } catch (error) {
        logger.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
};
