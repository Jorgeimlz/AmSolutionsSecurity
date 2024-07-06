const socialService = require('../services/socialService');
const Search = require('../models/Search');

exports.buscarEnlacesSociales = async (req, res) => {
    const query = req.body.query;

    try {
        const cuentas = await socialService.buscarEnlacesSociales(query);

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Social',
            query: query
        }).save();

        res.render('enlaces_sociales_resultados', { cuentas, query });
    } catch (error) {
        console.error('Error al buscar enlaces de redes sociales:', error);
        res.status(500).send('Error en el servidor');
    }
};
