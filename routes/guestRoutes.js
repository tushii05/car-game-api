const express = require('express');
const router = express.Router();
const guestPlayerController= require('../controllers/guestPlayerController');

router.post('/guestId',guestPlayerController.guestId);
router.put('/guest/edit', guestPlayerController.editGuestId); // Edit guest ID
router.get('/usersguestid',guestPlayerController.usersguestid);
router.delete('/deleteByGuestId/:id',guestPlayerController.deleteByGuestId);

module.exports = router;
    