const emailService = require('../services/emailService');
const { evaluarRiesgoCorreo } = require('../middlewares/evaluarRiesgo');

exports.buscarCorreos = async (req, res) => {
    const dominio = req.body.dominio;

    try {
        const correos = await emailService.buscarCorreos(dominio);
        const correosConRiesgo = correos.map(correo => ({
            ...correo,
            riesgo: evaluarRiesgoCorreo(correo)
        }));
        res.render('correos_resultados', { correos: correosConRiesgo, dominio });
    } catch (error) {
        console.error('Error al buscar correos electrónicos:', error);
        res.status(500).send('Error en el servidor');
    }
};
