const axios = require('axios');

exports.buscarSerper = async (query) => {
    const url = 'https://google.serper.dev/search';
    const data = JSON.stringify({ q: query });

    const response = await axios.post(url, data, {
        headers: {
            'X-API-KEY': process.env.SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    return response.data.organic;
};
