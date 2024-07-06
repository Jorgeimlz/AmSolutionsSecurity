const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/buscar', emailController.buscarCorreos);

module.exports = router;
