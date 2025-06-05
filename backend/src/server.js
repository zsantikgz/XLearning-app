const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Verificar conexion a DB antes de iniciar el servidor
pool.query('SELECT NOW()')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error al conectar a la base de datos:', err);
        process.exit(1); // Salir del proceso si no se puede conectar
    });