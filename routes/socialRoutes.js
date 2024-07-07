const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/buscar', verifyToken, socialController.buscarEnlacesSociales);
router.get('/reporte', verifyToken, socialController.generarReporteSocial);

module.exports = router;
