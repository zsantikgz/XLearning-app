const { query } = require('../config/db');
const logger = require('../utils/logger');

// POST
exports.subirEntrega = async (req, res) => {
    const { id_asignacion, id_estudiante, url_entrega } = req.body;

    try {
        // Validar entrega duplicada (opcional)
        const yaEntrego = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ASIGNACION = $1 AND ID_ESTUDIANTE = $2`,
            [id_asignacion, id_estudiante]
        );

        if (yaEntrego.rows.length > 0) {
            return res.status(409).json({ error: 'Entrega ya registrada para esta asignación' });
        }

        // Registrar entrega
        const { rows } = await query(
            `INSERT INTO ENTREGAS_ASIGNACIONES (ID_ASIGNACION, ID_ESTUDIANTE, URL_ENTREGA) 
             VALUES ($1, $2, $3) RETURNING *`,
            [id_asignacion, id_estudiante, url_entrega]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al subir entrega:', error);
        res.status(500).json({ error: 'Error al subir entrega' });
    }
};

// GET todas
exports.obtenerTodasEntregas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM ENTREGAS_ASIGNACIONES ORDER BY FECHA_ENTREGA DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas:', error);
        res.status(500).json({ error: 'Error al obtener entregas' });
    }
};

// GET por estudiante
exports.obtenerPorEstudiante = async (req, res) => {
    const { idEstudiante } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ESTUDIANTE = $1 ORDER BY FECHA_ENTREGA DESC`,
            [idEstudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener entregas del estudiante' });
    }
};

// GET por asignación
exports.obtenerPorAsignacion = async (req, res) => {
    const { idAsignacion } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ASIGNACION = $1 ORDER BY FECHA_ENTREGA DESC`,
            [idAsignacion]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas por asignación:', error);
        res.status(500).json({ error: 'Error al obtener entregas por asignación' });
    }
};

// DELETE
exports.eliminarEntrega = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM ENTREGAS_ASIGNACIONES WHERE ID_ENTREGA = $1', [id]);
        res.status(200).json({ mensaje: 'Entrega eliminada' });
    } catch (error) {
        logger.error('Error al eliminar entrega:', error);
        res.status(500).json({ error: 'Error al eliminar entrega' });
    }
};


exports.actualizarUrlEntrega = async (req, res) => {
    const { id } = req.params;
    const { url_entrega } = req.body;

    try {
        const result = await query(
            `UPDATE ENTREGAS_ASIGNACIONES 
             SET URL_ENTREGA = $1, FECHA_ENTREGA = NOW()
             WHERE ID_ENTREGA = $2 RETURNING *`,
            [url_entrega, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entrega no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Entrega actualizada correctamente',
            entrega: result.rows[0]
        });

    } catch (error) {
        logger.error('Error al actualizar URL de entrega:', error);
        res.status(500).json({ error: 'Error al actualizar la entrega' });
    }
};
