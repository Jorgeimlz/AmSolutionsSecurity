const hostService = require('../services/hostService');
const { evaluarRiesgoHost } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');

exports.buscarHost = async (req, res) => {
    const url = req.body.url;

    try {
        const hosts = await hostService.buscarHost(url);
        const hostsConRiesgo = hosts.map(host => ({
            ...host,
            riesgo: evaluarRiesgoHost(host)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Host',
            query: url
        }).save();

        res.render('host_resultados', { hosts: hostsConRiesgo, url });
    } catch (error) {
        console.error('Error al buscar datos de host:', error);
        res.status(500).send('Error en el servidor');
    }
};
