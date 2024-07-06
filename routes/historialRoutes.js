const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Search = require('../models/Search');

router.get('/historial', verifyToken, async (req, res) => {
    try {
        const historial = await Search.find({ user: req.userId }).sort({ date: -1 });
        res.render('historial', { historial });
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
