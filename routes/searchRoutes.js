const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/serper', searchController.buscarSerper);

module.exports = router;
