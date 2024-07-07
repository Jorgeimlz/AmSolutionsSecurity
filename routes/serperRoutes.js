const express = require('express');
const router = express.Router();
const serperController = require('../controllers/serperController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/serper', verifyToken, serperController.buscarSerper);
router.get('/reporte', verifyToken, serperController.generarReporteSerper);

module.exports = router;
