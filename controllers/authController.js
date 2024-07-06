const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión
    } catch (error) {
        res.status(500).send(error);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión con un mensaje de error
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false }); // Asegurarse de que la cookie se establece correctamente
        res.redirect('/index'); // Redirigir a la página principal después de iniciar sesión
    } catch (error) {
        res.status(500).send(error);
    }
};

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

module.exports = { register, login, verifyToken };
