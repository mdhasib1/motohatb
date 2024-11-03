const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/Order.controllers");
const {
    authenticateToken,
    authorizeAdmin,
  } = require("../middlewares/authMiddleware");

router.post("/create",authenticateToken, orderController.createOrder);
router.post("/payment-success", orderController.paymentSuccess); 
router.post("/payment-fail", orderController.paymentFail);
router.post("/payment-cancel", orderController.paymentCancel);
router.get("/verify-payment", orderController.verifyPayment);

router.post("/ipn", orderController.ipn); 
module.exports = router;
