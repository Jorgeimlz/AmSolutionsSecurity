const express = require('express');
const router = express.Router();
const serperController = require('../controllers/serperController');

router.post('/serper', serperController.buscarSerper);

module.exports = router;
