const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/buscar', verifyToken, hostController.buscarHost);
router.get('/reporte', verifyToken, hostController.generarReporteHosts);

module.exports = router;
