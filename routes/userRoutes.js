const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.get('/verify', userController.verifyEmail);
router.delete('/delete', userController.deleteUserByGuestId);

router.get('/users', userController.users);
module.exports = router;