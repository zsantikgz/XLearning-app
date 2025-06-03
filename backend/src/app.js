require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./config/db');


const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;

// // Rutas
// app.get('/', (req, res) => {
//   res.send('API XLearning funcionando');
// });

// // Iniciar servidor
// app.listen(process.env.PORT, () => {
//   console.log(`Servidor en http://localhost:${process.env.PORT}`);
// });