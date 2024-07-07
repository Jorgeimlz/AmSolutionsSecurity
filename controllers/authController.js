const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/auth/login');
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
            return res.redirect('/auth/login');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('/index');
    } catch (error) {
        res.status(500).send(error);
    }
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/auth/login');
        }
        req.userId = decoded.id;
        next();
    });
};

const logout = (req, res) => {
    res.clearCookie('token');  // Elimina la cookie que contiene el token
    res.redirect('/auth/login');  // Redirige al usuario a la página de inicio de sesión
};

module.exports = { register, login, verifyToken, logout };
