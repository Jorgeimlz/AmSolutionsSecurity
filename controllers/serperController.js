const serperService = require('../services/serperService');
const Search = require('../models/Search');

exports.buscarSerper = async (req, res) => {
    const query = req.body.query;

    try {
        const resultados = await serperService.buscarSerper(query);

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Serper',
            query: query
        }).save();

        res.render('serper_resultados', { resultados, query });
    } catch (error) {
        console.error('Error al buscar con Serper.dev:', error);
        res.status(500).send('Error en el servidor');
    }
};
