const express = require('express');
const { createChatMessage, getChats , getAdminId} = require('../Controllers/Chat.controllers');

const router = express.Router();

router.post('/chat', createChatMessage);
router.get('/chat/:userId1/:userId2', getChats);
router.get('/chat/admin', getAdminId)

module.exports = router;
