const express = require('express');
const router = express.Router();
const subdomainController = require('../controllers/subdomainController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/buscar', verifyToken, subdomainController.buscarSubdominios);
router.get('/reporte', verifyToken, subdomainController.generarReporteSubdominios);

module.exports = router;
