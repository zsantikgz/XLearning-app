const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../config/logger');


// LOGIN DE USUARIO
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Aqui se busca el usuario en la BD
        const { rows } = await query('SELECT * FROM USUARIOS WHERE EMAIL =$1', [email]);
        const usuario = rows[0];

    if (!usuario) {
        logger.error(`Inetento de login fallido: Email ${email} no encontrado`);
        return res.status(404).json({ error: 'Usuario no registrado' });
    }

    // 2. Aqui se compara y valida contrasena
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.constrasena);
    if (!contrasenaValida) {
        logger.error(`Intento de login fallido: Contraseña incorrecta para ${email}`);
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar el token de JWT (válida por 7 días)
    const token = jwt.sign(
        {
            userId: usuario.id_usuario,
            tipo_usuario: usuario.tipo_usuario,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // 4. Responder con token y datos basicos del usuario (para la app movil)
    res.json({
        token,
        user: {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        }
    });

    logger.info(`Login exitoso: Usuario ${usuario.email} conectado`);
    } catch (error) {
        logger.error('Error en el login:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
};

// REGISTRO DE USUARIO
exports.regitrar = async (req, res) => {
    const { email, constrasena, nombre, tipo_usuario } = req.body;

    try {
        // 1. HASH DE LA CONTRASENA
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(constrasena, salt);

        // 2. Guardar usuario en la BD
        const { rows } = await query(
            'INSERT INTO USUARIOS (EMAIL, CONTRASENA, NOMBRE, TIPO_USUARIO) VALUES$ ($1, $2, $3, $4) RETURNING *',
            [email, contrasenaHash, nombre, tipo_usuario] || 'estudiante' // Hace que por defecto sea estudiante al registrarse para evitar que estudiantes se registren como profesores
        );

        // 3. Generar token automaticamente tras el registro
        const token = jwt.sign(
            { userId: rows[0].id_usuario, tipo_usuario: rows[0].tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: rows[0]
        });

    } catch (error) {
        if (error.code === '23505') { // ESTE NUMERO DE ERROR ES POR UN EMIAL DUPLICADO
            res.status(400).json({ error: 'El email ya fue registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};