const express = require('express');
const router = express.Router();

// Define your task routes here
router.get('/', (req, res) => {
    res.send('Task route is working!');
});
module.exports = router;