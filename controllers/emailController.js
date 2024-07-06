const emailService = require('../services/emailService');
const { evaluarRiesgoCorreo } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');

exports.buscarCorreos = async (req, res) => {
    const dominio = req.body.dominio;

    try {
        const correos = await emailService.buscarCorreos(dominio);
        const correosConRiesgo = correos.map(correo => ({
            ...correo,
            riesgo: evaluarRiesgoCorreo(correo)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Correo',
            query: dominio
        }).save();

        res.render('correos_resultados', { correos: correosConRiesgo, dominio });
    } catch (error) {
        console.error('Error al buscar correos electrónicos:', error);
        res.status(500).send('Error en el servidor');
    }
};
