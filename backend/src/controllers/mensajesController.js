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

// Crear mensaje entre dos usuarios
exports.enviarMensaje = async (req, res) => {
    const { remitente, destinatario, texto } = req.body;

    if (!remitente || !destinatario || !texto) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Siempre ordenar los IDs para que el chat se guarde en el mismo documento
        const id1 = Math.min(remitente, destinatario);
        const id2 = Math.max(remitente, destinatario);
        const chatId = `${id1}_${id2}`;

        const nuevoMensaje = {
            remitente,
            texto,
            fecha: new Date()
        };

        await db.collection('mensajes')
            .doc(chatId)
            .collection('mensajes')
            .add(nuevoMensaje);

        res.status(201).json({ mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        logger.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
};

// Obtener mensajes entre dos usuarios
exports.obtenerConversacion = async (req, res) => {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
        return res.status(400).json({ error: 'Faltan IDs de usuarios' });
    }

    try {
        const user1 = Math.min(Number(id1), Number(id2));
        const user2 = Math.max(Number(id1), Number(id2));
        const chatId = `${user1}_${user2}`;

        const snapshot = await db.collection('mensajes')
            .doc(chatId)
            .collection('mensajes')
            .orderBy('fecha', 'asc')
            .get();

        const mensajes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(mensajes);
    } catch (error) {
        logger.error('Error al obtener conversación:', error);
        res.status(500).json({ error: 'Error al obtener conversación' });
    }
};

// Eliminar un mensaje específico
exports.eliminarMensaje = async (req, res) => {
    const { id1, id2, idMensaje } = req.params;

    try {
        const user1 = Math.min(Number(id1), Number(id2));
        const user2 = Math.max(Number(id1), Number(id2));
        const chatId = `${user1}_${user2}`;

        await db.collection('mensajes')
            .doc(chatId)
            .collection('mensajes')
            .doc(idMensaje)
            .delete();

        res.status(200).json({ mensaje: 'Mensaje eliminado' });
    } catch (error) {
        logger.error('Error al eliminar mensaje:', error);
        res.status(500).json({ error: 'Error al eliminar mensaje' });
    }
};


// Editar contenido del mensaje
// exports.editarMensaje = async (req, res) => {
//     const { id1, id2, idMensaje } = req.params;
//     const { texto } = req.body;

//     try {
//         const user1 = Math.min(Number(id1), Number(id2));
//         const user2 = Math.max(Number(id1), Number(id2));
//         const chatId = `${user1}_${user2}`;

//         await db.collection('mensajes')
//             .doc(chatId)
//             .collection('mensajes')
//             .doc(idMensaje)
//             .update({ texto });

//         res.status(200).json({ mensaje: 'Mensaje editado correctamente' });
//     } catch (error) {
//         logger.error('Error al editar mensaje:', error);
//         res.status(500).json({ error: 'Error al editar mensaje' });
//     }
// };


// Marcar mensaje como leído
// exports.marcarMensajeLeido = async (req, res) => {
//     const { id1, id2, idMensaje } = req.params;

//     try {
//         const user1 = Math.min(Number(id1), Number(id2));
//         const user2 = Math.max(Number(id1), Number(id2));
//         const chatId = `${user1}_${user2}`;

//         await db.collection('mensajes')
//             .doc(chatId)
//             .collection('mensajes')
//             .doc(idMensaje)
//             .update({ leido: true });

//         res.status(200).json({ mensaje: 'Mensaje marcado como leído' });
//     } catch (error) {
//         logger.error('Error al marcar mensaje como leído:', error);
//         res.status(500).json({ error: 'Error al marcar mensaje como leído' });
//     }
// };
