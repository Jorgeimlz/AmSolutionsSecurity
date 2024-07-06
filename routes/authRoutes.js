const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
