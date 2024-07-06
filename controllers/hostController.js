const hostService = require('../services/hostService');
const { evaluarRiesgoHost } = require('../middlewares/evaluarRiesgo');

exports.buscarHost = async (req, res) => {
    const url = req.body.url;

    try {
        const hosts = await hostService.buscarHost(url);
        console.log('Hosts recibidos:', hosts); // Para depuración
        const hostsConRiesgo = hosts.map(host => ({
            ...host,
            riesgo: evaluarRiesgoHost(host)
        }));
        res.render('host_resultados', { hosts: hostsConRiesgo, url });
    } catch (error) {
        console.error('Error al buscar datos de host:', error);
        res.status(500).send('Error en el servidor');
    }
};
