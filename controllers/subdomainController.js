const subdomainService = require('../services/subdomainService');
const { evaluarRiesgoSubdominio } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');

exports.buscarSubdominios = async (req, res) => {
    const dominio = req.body.dominio;

    try {
        const subdominios = await subdomainService.buscarSubdominios(dominio);
        const subdominiosConRiesgo = subdominios.map(sub => ({
            ...sub,
            riesgo: evaluarRiesgoSubdominio(sub)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Subdominio',
            query: dominio
        }).save();

        res.render('resultados', { subdominios: subdominiosConRiesgo, dominio });
    } catch (error) {
        console.error('Error al buscar subdominios:', error);
        res.status(500).send('Error en el servidor');
    }
};
