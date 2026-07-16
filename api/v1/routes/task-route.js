const express = require('express');
const router = express.Router();
const taskController = require('../controller/task-controller');
// Define your task routes here
router.get('/', taskController.index);
module.exports = router;