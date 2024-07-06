const socialService = require('../services/socialService');

exports.buscarEnlacesSociales = async (req, res) => {
    const query = req.body.query;

    try {
        const cuentas = await socialService.buscarEnlacesSociales(query);
        res.render('enlaces_sociales_resultados', { cuentas, query });
    } catch (error) {
        console.error('Error al buscar enlaces de redes sociales:', error);
        res.status(500).send('Error en el servidor');
    }
};
