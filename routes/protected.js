const express = require('express');
const router = express.Router();

// Example protected route
router.get('/', (req, res) => {
    res.json({ msg: 'This is a protected route.' });
});

module.exports = router;