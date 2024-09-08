const { Charge } = require('../Models/Charge.model');

const createCharge = async (req, res) => {
    try {
        const { platformCharge, additionalCharge, subCategory } = req.body;

        const existingCharge = await Charge.findOne({ subCategory });
        if (existingCharge) {
            return res.status(400).json({ success: false, error: 'Charge already exists for this subcategory. Please update the existing charge.' });
        }

        const newCharge = new Charge({
            platformCharge,
            additionalCharge,
            subCategory
        });

        await newCharge.save();
        res.status(201).json({ success: true, data: newCharge });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const getChargeById = async (req, res) => {
  try {
    const { id } = req.params;
    const charge = await Charge.findById(id).populate('Category');

    if (!charge) {
      return res.status(404).json({ success: false, error: 'Charge not found' });
    }

    res.status(200).json({ success: true, data: charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const updateCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { platformCharge, additionalCharge, subCategory } = req.body;

    const charge = await Charge.findById(id);
    if (!charge) {
      return res.status(404).json({ success: false, error: 'Charge not found' });
    }

    charge.platformCharge = platformCharge;
    charge.additionalCharge = additionalCharge;
    charge.subCategory = subCategory;
    charge.updatedAt = Date.now();

    await charge.save();
    res.status(200).json({ success: true, data: charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const deleteCharge = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Charge.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Charge not found' });
      }
      res.status(200).json({ success: true, message: 'Charge deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  };
  
  

  const getAllCharges = async (req, res) => {
    const { id } = req.params;
    try {
      const charges = await Charge.find();
      res.status(200).json({ success: true, data: charges });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  };
  


const getAllwithoutcatCharges = async (req, res) => {
    try {
        const charges = await Charge.find().populate('subCategory');
        res.status(200).json({ success: true, data: charges });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
      }      
  };
  

module.exports = {
  createCharge,
  getChargeById,
  updateCharge,
  deleteCharge,
  getAllCharges,
  getAllwithoutcatCharges
};
