const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.getUsuario = async (req, res) => {
    try{
        const result = await query('SELECT * FROM USUARIOS');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.getUsuarioId = async (req, res) => {
    // Implementacion para GET /usuario/{id}
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM USUARIOS WHERE ID_USUARIO = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        logger.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario por ID: ' + id });
    }
};

exports.updateUsuario = async (req, res) => {
    // Implementacion para PUT /usuario/{id}
    const { id } = req.params;
    const { email, contrasena, nombre, apellidos, tipo_usuario, telefono, matricula } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const result = await query(
            `UPDATE USUARIOS SET EMAIL = $1, CONTRASENA = $2, NOMBRE = $3, APELLIDOS = $4, TIPO_USUARIO = $5, TELEFONO = $6, MATRICULA = $7 WHERE ID_USUARIO = $8`,
            [email, hashedPassword, nombre, apellidos, tipo_usuario, telefono, matricula, id]
        )
    } catch (error) {
        logger.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// exports.getClasesEstudiante = async (req, res) => {
//     // Implementacion para GET /usuario/{id}/clases
//     const { id } = req.params;
//     try {
//         const result = await query(
//             `SELECT C.ID_CLASE, C.NOMBRE, C.ID_PROFESOR, C.NIVEL_ACADEMICO, FECHA_CREACION
//             FROM CLASES C
//             JOIN`
//         )
//     } catch (error) {
//         logger.error('Error al obtener clases del estudiante:', error);
//         res.status(500).json({ error: 'Error al obtener clases del estudiante' });
//     }
// }
