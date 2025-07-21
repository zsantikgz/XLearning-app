// controllers/notificacionEstudianteController.js
const db = require('../../firebase/firebase');
const logger = require('../utils/logger');

// Crear notificacion
exports.crearNotificacionEstudiante = async (req, res) => {
    const {
        titulo,
        contenido,
        id_estudiante,
        id_clase,
        tipo,
        importancia,
        creado_por
    } = req.body;

    try {
        const ref = await db.collection('notificaciones_estudiantes').add({
            titulo,
            contenido,
            id_estudiante,
            id_clase,
            tipo,
            importancia,
            creado_por,
            leido: false,
            fecha: new Date()
        });

        res.status(201).json({ id: ref.id, mensaje: 'Notificación creada correctamente' });
    } catch (error) {
        logger.error('Error al crear notificacion estudiante:', error);
        res.status(500).json({ error: 'Error al crear notificacion estudiante' });
    }
};

// Obtener todas
exports.obtenerTodasNotificacionesEstudiantes = async (req, res) => {
    try {
        const snapshot = await db.collection('notificaciones_estudiantes')
            .orderBy('fecha', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        logger.error('Error al obtener todas las notificaciones estudiantes:', error);
        res.status(500).json({ error: 'Error al obtener todas las notificaciones' });
    }
};

// Obtener por estudiante
exports.obtenerPorEstudiante = async (req, res) => {
    try {
        const { idEstudiante } = req.params;

        const snapshot = await db.collection('notificaciones_estudiantes')
            .where('id_estudiante', '==', Number(idEstudiante)) // <-- CORREGIDO
            .orderBy('fecha', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        console.error('🔥 Error exacto:', error);
        res.status(500).json({ error: error.message });
    }
};


// Obtener por clase
exports.obtenerPorClase = async (req, res) => {
    try {
        const snapshot = await db.collection('notificaciones_estudiantes')
            .where('id_clase', '==', Number(req.params.idClase))
            .orderBy('fecha', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        // logger.error('Error al obtener por clase:', error);
        // res.status(500).json({ error: 'Error al obtener notificaciones por clase' });
        console.error('🔥 Error exacto:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener por creador
exports.obtenerPorCreador = async (req, res) => {
    try {
        const snapshot = await db.collection('notificaciones_estudiantes')
            .where('creado_por', '==', Number(req.params.idCreador))
            .orderBy('fecha', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        // logger.error('Error al obtener por creador:', error);
        // res.status(500).json({ error: 'Error al obtener notificaciones por creador' });
        console.error('🔥 Error exacto:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener por importancia
exports.obtenerPorImportancia = async (req, res) => {
    try {
        const snapshot = await db.collection('notificaciones_estudiantes')
            .where('importancia', '==', req.params.importancia.toLowerCase())
            .orderBy('fecha', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        // logger.error('Error al obtener por importancia:', error);
        // res.status(500).json({ error: 'Error al obtener notificaciones por importancia' });
        console.error('🔥 Error exacto:', error);
        res.status(500).json({ error: error.message });
    }
};

// Marcar como leida
exports.marcarComoLeida = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('notificaciones_estudiantes').doc(id).update({ leido: true });
        res.status(200).json({ mensaje: 'Notificacion marcada como leida' });
    } catch (error) {
        logger.error('Error al marcar como leida:', error);
        res.status(500).json({ error: 'Error al marcar como leida' });
    }
};

// Editar notificacion completa
exports.editarNotificacion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('notificaciones_estudiantes').doc(id).update(req.body);
        res.status(200).json({ mensaje: 'Notificacion actualizada' });
    } catch (error) {
        logger.error('Error al editar notificacion:', error);
        res.status(500).json({ error: 'Error al editar notificacion' });
    }
};

// Eliminar
exports.eliminarNotificacion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('notificaciones_estudiantes').doc(id).delete();
        res.status(200).json({ mensaje: 'Notificacion eliminada' });
    } catch (error) {
        logger.error('Error al eliminar notificacion:', error);
        res.status(500).json({ error: 'Error al eliminar notificacion' });
    }
};