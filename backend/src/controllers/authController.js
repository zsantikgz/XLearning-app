const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../utils/logger');


// LOGIN DE USUARIO
exports.login = async (req, res) => {
   

    try {
        // 1. Aqui se busca el usuario en la BD
        const { email, contrasena } = req.body;
        const { rows } = await query('SELECT * FROM USUARIOS WHERE EMAIL =$1', [email]);
        const usuario = rows[0];

    if (!usuario) {
        logger.error(`Inetento de login fallido: Email ${email} no encontrado`);
        return res.status(404).json({ error: 'Usuario no registrado' });
    }

    // 2. Aqui se compara y valida contrasena
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena); 
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
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            matricula: usuario.matricula,
            tipo_usuario: usuario.tipo_usuario
        }
    });

    logger.info(`Login exitoso: Usuario ${usuario.email} conectado`);
    } catch (error) {
        logger.error('Error en el login:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
};

// LOGIN DE PROFESOR
exports.loginProfesor = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const { rows } = await query('SELECT * FROM USUARIOS WHERE EMAIL = $1', [email]);
        const usuario = rows[0];

        if (!usuario) {
            logger.error(`Intento de login fallido: Email ${email} no encontrado`);
            return res.status(404).json({ error: 'Usuario no registrado' });
        }

        // Validar que el usuario sea PROFESOR
        if (usuario.tipo_usuario !== 'PROFESOR') {
            logger.error(`Intento de login fallido: Usuario ${email} no es profesor`);
            return res.status(403).json({ error: 'Acceso denegado: No es profesor' });
        }

        // Validar contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            logger.error(`Intento de login fallido: Contraseña incorrecta para ${email}`);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                userId: usuario.id_usuario,
                tipo_usuario: usuario.tipo_usuario,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: usuario.id_usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                matricula: usuario.matricula,
                tipo_usuario: usuario.tipo_usuario
            }
        });

        logger.info(`Login exitoso: Profesor ${usuario.email} conectado`);
    } catch (error) {
        logger.error('Error en el login de profesor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// REGISTRO DE USUARIO
exports.registrar = async (req, res) => {
    const { email, contrasena, nombre, apellidos, telefono, matricula } = req.body;

    // Determinar tipo de usuario basado en el dominio del email
    const esProfesor = email.toLowerCase().endsWith('@elon.school');
    const tipoUsuario = esProfesor ? 'PROFESOR' : 'ESTUDIANTE';

    try {
        // 1. HASH DE LA CONTRASEÑA
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(contrasena, salt);

        // 2. Guardar usuario en la BD
        const { rows } = await query(
            `INSERT INTO USUARIOS 
            (EMAIL, CONTRASENA, NOMBRE, APELLIDOS, TIPO_USUARIO, TELEFONO, MATRICULA) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [email, contrasenaHash, nombre, apellidos, tipoUsuario, telefono, matricula]
        );

        // 3. Generar token automáticamente tras el registro
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
        console.error('Error en registrar: ', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'El email ya fue registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
