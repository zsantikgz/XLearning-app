const db = require('../../firebase/firebase'); // <-- Asegúrate de usar la ruta correcta
const logger = require('../utils/logger');

exports.crearNotificacion = async (req, res) => {
    const { titulo, contenido, para_usuario, tipo } = req.body;

    try {
        const ref = await db.collection('notificaciones').add({
            titulo,
            contenido,
            para_usuario,
            tipo,
            leida: false,
            fecha: new Date()
        });
        res.status(201).json({ id: ref.id, mensaje: 'Notificación creada correctamente' });
    } catch (error) {
        logger.error('Error al crear notificación:', error);
        res.status(500).json({ error: 'Error al crear notificación' });
    }
};

exports.obtenerNotificacionesPorUsuario = async (req, res) => {
  const { id_clase } = req.params;
  try {
      const result = await query(
          `SELECT 
              ec.*, 
              u.nombre, 
              u.apellidos 
           FROM ESTUDIANTES_CLASES ec
           JOIN USUARIOS u ON ec.ID_ESTUDIANTE = u.ID_USUARIO
           WHERE ec.ID_CLASE = $1`,
          [id_clase]
      );
      res.status(200).json(result.rows);
  } catch (error) {
      logger.error('Error al obtener estudiantes de la clase: ', error);
      res.status(500).json({ error: 'Error al obtener estudiantes de la clase' });
  }
};

// obtener todas las notificaciones
exports.obtenerTodasNotificaciones = async (req, res) => {
    try {
        const snapshot = await db.collection('notificaciones')
            .orderBy('fecha', 'desc')
            .get();

        const notificaciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};