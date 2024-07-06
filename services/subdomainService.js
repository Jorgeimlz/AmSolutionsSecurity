const axios = require('axios');

exports.buscarSubdominios = async (dominio) => {
    const url = `https://subdomain-finder3.p.rapidapi.com/v1/subdomain-finder/?domain=${dominio}`;

    const response = await axios.get(url, {
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'subdomain-finder3.p.rapidapi.com'
        }
    });

    return response.data.subdomains;
};
