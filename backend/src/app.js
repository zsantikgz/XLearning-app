require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./config/db');
const app = express();

app.get('/', (req, res) => {
    res.send('✅ Backend XLearning funcionando');
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const claseRoutes = require('./routes/claseRoutes');
const estudianteClaseRoutes = require('./routes/estudianteClaseRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const participacionRoutes = require('./routes/participacionRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');
const cuadroHonorRoutes = require('./routes/cuadroHonorRoutes');
const anuncioRoutes = require ('./routes/anuncioRoutes')
const entregaRoutes = require ('./routes/entregaRoutes');
const calificacionRoutes = require ('./routes/calificacionRoutes');
const recompensaRoutes = require ('./routes/recompensaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const asistenciaEventoRoutes = require('./routes/asistenciaEventoRoutes');
const certificacionRoutes = require('./routes/certificacionRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
// const mensajeRoutes = require('./routes/mensajeRoutes');
const vistaRoutes = require('./routes/vistaRoutes');
const notificacionPushRoutes = require('./routes/notificacionPushRoutes');
const canjeRoutes = require('./routes/canjeRoutes');
const usuarioTokensRoutes = require('./routes/usuarioTokensRoutes');
const notificacionEstudianteRoutes = require('./routes/notificacionEstudianteRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');
const felicitacionesRoutes = require('./routes/felicitacionesRoutes');


// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/estudiantes-clases', estudianteClaseRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/participaciones', participacionRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/cuadro-honor', cuadroHonorRoutes);
app.use('/api/anuncios', anuncioRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/recompensas', recompensaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/asistencia-eventos', asistenciaEventoRoutes);
app.use('/api/certificaciones', certificacionRoutes);
app.use('/api/notificaciones', notificacionRoutes);
// app.use('/api/mensajes', mensajeRoutes);
app.use('/api/vistas', vistaRoutes);
app.use('/api/notificaciones', notificacionPushRoutes);
app.use('/api/canjes', canjeRoutes);
app.use('/api/usuario-tokens', usuarioTokensRoutes);
app.use('/api/notificaciones-estudiantes', notificacionEstudianteRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/felicitaciones', felicitacionesRoutes);


// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
