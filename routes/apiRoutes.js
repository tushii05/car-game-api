const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController.js');

router.post('/scores', scoreController.saveScore);
module.exports = router;
