const express = require('express');
const router = express.Router();
const guestUserController = require('../Controllers/Guest.Controller');


router.post('/create-temporary-user', guestUserController.createTemporaryUser);

module.exports = router;
