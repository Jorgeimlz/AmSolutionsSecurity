const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');

router.post('/buscar', hostController.buscarHost);

module.exports = router;
