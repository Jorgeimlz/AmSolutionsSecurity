const axios = require('axios');
const { evaluarRiesgoCuenta } = require('../middlewares/evaluarRiesgo');

exports.buscarEnlacesSociales = async (query) => {
    const url = 'https://social-links-search.p.rapidapi.com/search-social-links';
    const params = {
        query: query,
        social_networks: 'facebook,tiktok,instagram,snapchat,twitter,youtube,linkedin,github,pinterest'
    };

    const response = await axios.get(url, {
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'social-links-search.p.rapidapi.com'
        },
        params: params
    });

    // Asegúrate de que devuelve un array de cuentas
    const enlacesSociales = response.data.data;
    let cuentas = [];

    Object.keys(enlacesSociales).forEach(red => {
        enlacesSociales[red].forEach(enlace => {
            cuentas.push({
                red,
                enlace,
                riesgo: evaluarRiesgoCuenta({ username: query })
            });
        });
    });

    return cuentas;
};
