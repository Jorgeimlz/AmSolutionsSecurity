const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/buscar', verifyToken, emailController.buscarCorreos);
router.get('/reporte', verifyToken, emailController.generarReporteCorreos);

module.exports = router;
