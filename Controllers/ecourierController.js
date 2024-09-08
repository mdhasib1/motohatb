const ecourierService = require("../services/ecourierService");

const getCity = async (req, res) => {
  try {
    const cities = await ecourierService.getCity();
    res.status(200).json({ cities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getThanaList = async (req, res) => {
  const { city } = req.body;
  try {
    const thanaList = await ecourierService.getThanaList(city);
    res.status(200).json({ thanaList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAreaList = async (req, res) => {
  const { postcode } = req.body;
  try {
    const areaList = await ecourierService.getAreaList(postcode);
    res.status(200).json({ areaList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBranchList = async (req, res) => {
  try {
    const branchList = await ecourierService.getBranchList();
    res.status(200).json({ branchList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await ecourierService.getPackages();
    res.status(200).json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const parcelTracking = async (req, res) => {
  const { product_id, ecr } = req.body;
  try {
    const result = await ecourierService.parcelTracking(product_id, ecr);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const { tracking, comment } = req.body;
  try {
    const result = await ecourierService.cancelOrder(tracking, comment);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const paymentStatus = async (req, res) => {
  const { tracking } = req.body;
  try {
    const paymentStatus = await ecourierService.paymentStatus(tracking);
    res.status(200).json({ paymentStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const placeOrderReseller = async (req, res) => {
  const orderData = req.body;
  try {
    const orderResponse = await ecourierService.placeOrderReseller(orderData);
    res.status(200).json(orderResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCity,
  getThanaList,
  getAreaList,
  getBranchList,
  getPackages,
  parcelTracking,
  cancelOrder,
  paymentStatus,
  placeOrderReseller,
};
