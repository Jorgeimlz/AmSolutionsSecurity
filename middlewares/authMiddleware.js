const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión si no hay token
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión si el token no es válido
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
