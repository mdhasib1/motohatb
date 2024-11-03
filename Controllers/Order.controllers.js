const Order = require("../Models/Order.model");
const Product = require('../Models/Product.model'); 
const SSLCommerz = require('sslcommerz-nodejs');
require('dotenv').config();



const fetch = require('node-fetch'); 

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount, billingAddress, shippingAddress, paymentMethod, email } = req.body;
    const user = req.user;

    const store_id = process.env.SSL_COMMERZ_STORE_ID;
    const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.area?.area_name ||
      !shippingAddress.thana?.name ||
      !shippingAddress.city?.city_name ||
      !shippingAddress.zipcode ||
      !shippingAddress.district?.name ||
      !shippingAddress.division?.name ||
      !shippingAddress.zone?.zone_name
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required shipping address fields. Please provide all necessary information.',
      });
    }

    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product).populate('seller', '_id name');
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }
        return {
          product: item.product,
          seller: product.seller._id, 
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    const newOrder = new Order({
      user: user._id,
      products: productDetails,
      totalAmount,
      billingAddress: {
        recipient_name: billingAddress.name,
        recipient_mobile: billingAddress.phone,
        recipient_address: billingAddress.address,
        recipient_city: billingAddress.city?.city_name,
        recipient_thana: billingAddress.thana?.name,
        recipient_area: billingAddress.area?.area_name,
        recipient_zip: billingAddress.zipcode,
        recipient_district: billingAddress.district?.name,
        recipient_division: billingAddress.division?.name,
      },
      shippingAddress: {
        recipient_name: shippingAddress.name,
        recipient_mobile: shippingAddress.phone,
        recipient_address: shippingAddress.address,
        recipient_city: shippingAddress.city?.city_name,
        recipient_thana: shippingAddress.thana?.name,
        recipient_union: shippingAddress.address,
        recipient_area: shippingAddress.area?.area_name,
        recipient_postcode: shippingAddress.zipcode,
        recipient_district: shippingAddress.district?.name,
        recipient_division: shippingAddress.division?.name,
        recipient_zone: shippingAddress.zone?.zone_name,
      },
      paymentStatus: paymentMethod === 'COD' ? 'cod' : 'unpaid',
    });

    const savedOrder = await newOrder.save();

    if (paymentMethod !== 'COD') {
      const transactionId = `ORDER_${savedOrder._id}`;

      const sslCommerzData = {
        store_id: store_id,
        store_passwd: store_passwd,
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.FRONTEND_URI}/orders/payment-success?tran_id=${transactionId}`,
        fail_url: `${process.env.FRONTEND_URI}/orders/payment-fail`,
        cancel_url: `${process.env.FRONTEND_URI}/orders/payment-cancel`,
        shipping_method: 'Courier',
        product_name: 'Products',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: shippingAddress.name,
        cus_email: email || 'N/A',
        cus_add1: shippingAddress.address,
        cus_city: shippingAddress.city.city_name,
        cus_postcode: shippingAddress.zipcode,
        cus_country: 'Bangladesh',
        cus_phone: shippingAddress.phone,

        ship_name: shippingAddress.name || 'Store Test',
        ship_add1: shippingAddress.address,
        ship_city: shippingAddress.city.city_name,
        ship_postcode: shippingAddress.zipcode,
        ship_country: 'Bangladesh',
      };

      const urlEncodedData = new URLSearchParams(sslCommerzData).toString();

      const sslcommerzUrl = is_live
        ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

      try {
        const response = await fetch(sslcommerzUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodedData,
        });

        const apiResponse = await response.json();

        console.log(apiResponse)

        if (apiResponse.GatewayPageURL) {
          return res.json({ status: 'success', payment_url: apiResponse.GatewayPageURL });
        } else {
          return res.status(500).json({ status: 'fail', message: 'Error initiating payment' });
        }
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ status: 'error', message: `Error creating order: ${error.message}` });
      }
    } else {
      res.status(201).json({ status: 'success', message: 'Order placed with COD', order: savedOrder });
    }
  } catch (error) {
    console.error('Error creating order:', error); 
    res.status(500).json({ status: 'error', message: `Error creating order: ${error.message}` });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { tran_id } = req.query;
    
    if (!tran_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction ID is missing',
      });
    }

    const validationUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?tran_id=${tran_id}&store_id=${process.env.SSL_COMMERZ_STORE_ID}&store_passwd=${process.env.SSL_COMMERZ_STORE_PASSWORD}&v=1&format=json`;


    const response = await fetch(validationUrl);
    console.log(response)
    const validationData = await response.json();


    if (validationData.status === 'VALID') {
      const orderId = tran_id.replace('ORDER_', ''); 

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: 'paid' },
        { new: true }
      );

      return res.status(200).json({
        status: 'success',
        message: 'Payment validated successfully',
        order: updatedOrder, 
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Payment validation failed',
      });
    }
  } catch (error) {
    console.error('Error in payment verification:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during payment verification',
    });
  }
};



exports.paymentSuccess = async (req, res) => {
  try {
    const { val_id, tran_id } = req.body;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const validationResponse = await sslcz.validate({ val_id });
    if (validationResponse.status === "VALID") {
      const orderId = tran_id.split("_")[1];
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "processing",
      }, { new: true });

      res.status(200).json({ status: "success", message: "Payment successful", order: updatedOrder });
    } else {
      res.status(400).json({ status: "error", message: "Payment validation failed" });
    }
  } catch (error) {
    console.error("Error validating payment:", error);
    res.status(500).json({ status: "error", message: "Error validating payment" });
  }
};

exports.paymentFail = (req, res) => {
  res.status(400).json({ status: "fail", message: "Payment failed" });
};

exports.paymentCancel = (req, res) => {
  res.status(400).json({ status: "cancelled", message: "Payment cancelled" });
};

exports.ipn = async (req, res) => {
  try {
    const { val_id, tran_id } = req.body;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const validationResponse = await sslcz.validate({ val_id });
    if (validationResponse.status === "VALID") {
      const orderId = tran_id.split("_")[1];
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "processing",
      }, { new: true });

      res.status(200).json({ status: "success", message: "IPN received and payment validated", order: updatedOrder });
    } else {
      res.status(400).json({ status: "error", message: "IPN validation failed" });
    }
  } catch (error) {
    console.error("Error processing IPN:", error);
    res.status(500).json({ status: "error", message: "Error processing IPN" });
  }
};
