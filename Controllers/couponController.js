const Coupon = require('../Models/Coupon');

const createCoupon = async (req, res) => {
    console.log(req.body)
  try {
    const { code, type, value, maxDiscount, expirationDate, productId } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const newCoupon = new Coupon({
      code,
      discountType:type,
      discountValue:value,
      expirationDate,
      applicableProducts:productId,
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate('applicableProducts');
    console.log(coupons)
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('applicableProducts applicableCategories applicableStores createdBy');
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, maxDiscount, expirationDate, usageLimit, applicableProducts, applicableCategories, applicableStores } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.code = code;
    coupon.discountType = discountType;
    coupon.discountValue = discountValue;
    coupon.maxDiscount = maxDiscount;
    coupon.expirationDate = expirationDate;
    coupon.usageLimit = usageLimit;
    coupon.applicableProducts = applicableProducts;
    coupon.applicableCategories = applicableCategories;
    coupon.applicableStores = applicableStores;
    coupon.updatedAt = Date.now();

    await coupon.save();
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.remove();
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon
};
