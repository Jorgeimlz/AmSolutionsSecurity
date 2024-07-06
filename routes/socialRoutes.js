const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');

router.post('/buscar', socialController.buscarEnlacesSociales);

module.exports = router;
