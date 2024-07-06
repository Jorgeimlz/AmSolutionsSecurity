const express = require('express');
const { verifyToken } = require('../controllers/authController');
const Search = require('../models/search');
const User = require('../models/User');
const router = express.Router();

router.get('/history', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('searchHistory');
        res.send(user.searchHistory);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/search', verifyToken, async (req, res) => {
    const { query } = req.body;
    try {
        const search = new Search({ query, user: req.userId });
        await search.save();
        await User.findByIdAndUpdate(req.userId, { $push: { searchHistory: search._id } });
        res.status(201).send(search);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
