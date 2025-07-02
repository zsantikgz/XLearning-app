// controllers/notificacionPushController.js
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.enviarNotificacionExpo = async (req, res) => {
  const { token, titulo, cuerpo } = req.body;

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  const mensaje = {
    to: token,
    sound: 'default',
    title: titulo,
    body: cuerpo,
    data: { tipo: 'notificacion' },
  };

  try {
    const tickets = await expo.sendPushNotificationsAsync([mensaje]);
    res.status(200).json({ mensaje: 'Notificación enviada', tickets });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
};
