const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear anuncio
exports.crearAnuncio = async (req, res) => {
    const { id_clase, titulo, descripcion } = req.body;

    try {
        const { rows } = await query(
            `INSERT INTO ANUNCIOS (ID_CLASE, TITULO, DESCRIPCION) 
             VALUES ($1, $2, $3) RETURNING *`,
            [id_clase, titulo, descripcion]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear anuncio:', error);
        res.status(500).json({ error: 'Error al crear el anuncio' });
    }
};

// Obtener todos los anuncios
exports.obtenerTodosAnuncios = async (req, res) => {
    try {
        const result = await query('SELECT * FROM ANUNCIOS ORDER BY FECHA_CREACION DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios:', error);
        res.status(500).json({ error: 'Error al obtener anuncios' });
    }
};

// Obtener anuncios por clase
exports.obtenerAnunciosPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            'SELECT * FROM ANUNCIOS WHERE ID_CLASE = $1 ORDER BY FECHA_CREACION DESC',
            [idClase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por clase:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por clase' });
    }
};

// Editar anuncio
exports.editarAnuncio = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    try {
        const result = await query(
            `UPDATE ANUNCIOS 
             SET TITULO = $1, DESCRIPCION = $2 
             WHERE ID_ANUNCIO = $3 RETURNING *`,
            [titulo, descripcion, id]
        );

        res.status(200).json({ mensaje: 'Anuncio actualizado', anuncio: result.rows[0] });
    } catch (error) {
        logger.error('Error al editar anuncio:', error);
        res.status(500).json({ error: 'Error al editar anuncio' });
    }
};

// Eliminar anuncio
exports.eliminarAnuncio = async (req, res) => {
    const { id } = req.params;

    try {
        await query('DELETE FROM ANUNCIOS WHERE ID_ANUNCIO = $1', [id]);
        res.status(200).json({ mensaje: 'Anuncio eliminado' });
    } catch (error) {
        logger.error('Error al eliminar anuncio:', error);
        res.status(500).json({ error: 'Error al eliminar anuncio' });
    }
};
