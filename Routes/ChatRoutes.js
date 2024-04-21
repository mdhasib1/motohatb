const express = require('express');
const chatControllers = require('../Controllers/Chat.controllers');
const {protect,admin} = require("../Middleware/Protect");


module.exports = (io) => {
  const router = express.Router();

  router.post('/send',  (req, res) => chatControllers.sendMessageToAdmin(req, res, io));
  router.get('/get', protect, (req, res) => chatControllers.getMessagesForAdmin(req, res, io));

  return router;
};
