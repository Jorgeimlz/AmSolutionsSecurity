const axios = require('axios');

exports.buscarHost = async (url) => {
    const apiKey = process.env.HOST_API_KEY; // Asegúrate de que esta clave API esté en tu archivo .env
    const apiUrl = `https://www.who-hosts-this.com/API/Host?key=${apiKey}&url=${url}`;

    try {
        const response = await axios.get(apiUrl);
        console.log('Respuesta del servicio de hosts:', response.data); // Agregar para depuración
        return response.data.results; // Verifica que response.data.results sea un array de hosts
    } catch (error) {
        console.error('Error al buscar datos de Who-Hosts-This:', error);
        throw error;
    }
};
