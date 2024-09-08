const express = require('express');
const chatController = require('../Controllers/Chat.controllers');
const router = express.Router();

router.post('/createChat', chatController.createChat);
router.get('/getChat/:chatId', chatController.getChat);
router.post('/sendMessage', chatController.sendMessage);
router.post('/startGuestChat', chatController.startGuestChat);
router.post('/transferGuestChats', chatController.transferGuestChats);
router.get('/inbox/:userId', chatController.getInbox);

module.exports = router;
