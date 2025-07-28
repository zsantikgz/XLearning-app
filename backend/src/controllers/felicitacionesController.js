const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear una felicitación
exports.crearFelicitacion = async (req, res) => {
    const { id_usuario, fecha_cumple, url_video, mensaje } = req.body;

    try {
        const result = await query(
            `INSERT INTO FELICITACIONES_USUARIOS 
            (ID_USUARIO, FECHA_CUMPLE, URL_VIDEO, MENSAJE) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_usuario, fecha_cumple, url_video, mensaje || '¡Feliz cumpleaños!']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al crear felicitación:', error);
        res.status(500).json({ error: 'Error al crear felicitación' });
    }
};

// Obtener todas las felicitaciones
exports.obtenerTodasFelicitaciones = async (req, res) => {
    try {
        const result = await query('SELECT * FROM FELICITACIONES_USUARIOS ORDER BY FECHA_CUMPLE DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener felicitaciones:', error);
        res.status(500).json({ error: 'Error al obtener felicitaciones' });
    }
};

// Obtener felicitaciones por ID de usuario
exports.obtenerPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const result = await query(
            'SELECT * FROM FELICITACIONES_USUARIOS WHERE ID_USUARIO = $1 ORDER BY FECHA_CUMPLE DESC',
            [idUsuario]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener felicitaciones por usuario:', error);
        res.status(500).json({ error: 'Error al obtener felicitaciones por usuario' });
    }
};

// Editar felicitación
exports.editarFelicitacion = async (req, res) => {
    const { id } = req.params;
    const { fecha_cumple, url_video, mensaje } = req.body;

    try {
        const result = await query(
            `UPDATE FELICITACIONES_USUARIOS 
             SET FECHA_CUMPLE = $1, URL_VIDEO = $2, MENSAJE = $3 
             WHERE ID_FELICITACIONES = $4 RETURNING *`,
            [fecha_cumple, url_video, mensaje, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Felicitación no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Felicitación actualizada',
            felicitacion: result.rows[0]
        });
    } catch (error) {
        logger.error('Error al editar felicitación:', error);
        res.status(500).json({ error: 'Error al editar felicitación' });
    }
};


// Editar felicitación por ID de usuario (solo la primera encontrada)
exports.editarPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    const { fecha_cumple, url_video, mensaje } = req.body;

    try {
        const result = await query(
            `UPDATE FELICITACIONES_USUARIOS 
             SET FECHA_CUMPLE = $1, URL_VIDEO = $2, MENSAJE = $3 
             WHERE ID_USUARIO = $4 
             RETURNING *`,
            [fecha_cumple, url_video, mensaje, idUsuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Felicitación no encontrada para este usuario' });
        }

        res.status(200).json({
            mensaje: 'Felicitación actualizada por ID de usuario',
            felicitacion: result.rows[0]
        });
    } catch (error) {
        logger.error('Error al editar felicitación por usuario:', error);
        res.status(500).json({ error: 'Error al editar felicitación por usuario' });
    }
};
