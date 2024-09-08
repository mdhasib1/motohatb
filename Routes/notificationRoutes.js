const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
  getNotificationById
} = require('../Controllers//notificationController');

router.post('/notifications', createNotification);
router.get('/notifications/user/:id', getNotificationsByUserId);
router.get('/notifications/:id', getNotificationById);
router.put('/notifications/:id/read', markNotificationAsRead);
router.delete('/notifications/:id', deleteNotification);

module.exports = router;
