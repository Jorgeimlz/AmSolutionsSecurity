const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Establecer EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas
const subdomainRoutes = require('./routes/subdomainRoutes');
const emailRoutes = require('./routes/emailRoutes');
const socialRoutes = require('./routes/socialRoutes');
const hostRoutes = require('./routes/hostRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Usar rutas
app.use('/subdominios', subdomainRoutes);
app.use('/correos', emailRoutes);
app.use('/cuentas', socialRoutes);
app.use('/host', hostRoutes);
app.use('/buscar', searchRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/riesgo/:nivel/:dominio', (req, res) => {
    const nivel = req.params.nivel;
    const dominio = decodeURIComponent(req.params.dominio);
    res.render('detalle_riesgo', { nivel: nivel, dominio: dominio });
});


// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
