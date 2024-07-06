const axios = require('axios');

exports.buscarCorreos = async (dominio) => {
    const url = `https://api.hunter.io/v2/domain-search?domain=${dominio}&api_key=${process.env.HUNTER_API_KEY}`;

    const response = await axios.get(url);
    return response.data.data.emails;
};
