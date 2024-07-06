const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const verifyToken = require('./middlewares/authMiddleware'); // Importar el middleware de autenticación

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Establecer EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
});

// Importar rutas
const subdomainRoutes = require('./routes/subdomainRoutes');
const emailRoutes = require('./routes/emailRoutes');
const socialRoutes = require('./routes/socialRoutes');
const hostRoutes = require('./routes/hostRoutes');
const serperRoutes = require('./routes/serperRoutes');
const authRoutes = require('./routes/authRoutes');

// Usar rutas
app.use('/subdominios', subdomainRoutes);
app.use('/correos', emailRoutes);
app.use('/cuentas', socialRoutes);
app.use('/host', hostRoutes);
app.use('/buscar', serperRoutes);
app.use('/auth', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión
});

// Rutas protegidas
app.get('/index', verifyToken, (req, res) => {
    res.render('index');
});

app.get('/riesgo/:nivel/:dominio', verifyToken, (req, res) => {
    const nivel = req.params.nivel;
    const dominio = decodeURIComponent(req.params.dominio);
    res.render('detalle_riesgo', { nivel: nivel, dominio: dominio });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
