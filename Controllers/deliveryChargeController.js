const DeliveryCharge = require('../Models//DeliveryCharge.model');

const createDeliveryCharge = async (req, res) => {
  try {
    const existingCharge = await DeliveryCharge.findOne();
    if (existingCharge) {
      return res.status(400).json({ success: false, error: 'Delivery charges already exist. Please update the existing charges.' });
    }

    const deliveryCharge = new DeliveryCharge(req.body);
    await deliveryCharge.save();
    res.status(201).json({ success: true, data: deliveryCharge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getDeliveryChargeById = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.findById(req.params.id);
    if (!deliveryCharge) {
      return res.status(404).json({ success: false, error: 'Delivery Charge not found' });
    }
    res.status(200).json({ success: true, data: deliveryCharge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const updateDeliveryCharge = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.findById(req.params.id);
    if (!deliveryCharge) {
      return res.status(404).json({ success: false, error: 'Delivery Charge not found' });
    }
    
    Object.assign(deliveryCharge, req.body);
    await deliveryCharge.save();
    res.status(200).json({ success: true, data: deliveryCharge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete Delivery Charge
const deleteDeliveryCharge = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.findById(req.params.id);
    if (!deliveryCharge) {
      return res.status(404).json({ success: false, error: 'Delivery Charge not found' });
    }

    await deliveryCharge.remove();
    res.status(200).json({ success: true, message: 'Delivery Charge deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get All Delivery Charges
const getAllDeliveryCharges = async (req, res) => {
  try {
    const deliveryCharges = await DeliveryCharge.find();
    res.status(200).json({ success: true, data: deliveryCharges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createDeliveryCharge,
  getDeliveryChargeById,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  getAllDeliveryCharges
};
