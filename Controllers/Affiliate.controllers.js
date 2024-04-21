const User = require('../Models/User.model');

const affiliateController = {
  register: async (req, res, io) => {
    try {
      const { email, password, fullName, phone, role, parent_id } = req.body;

      const referral_id = generateReferralId();

      let parentUser = null;
      if (parent_id) {
        parentUser = await User.findOne({ referral_id: parent_id });
        if (!parentUser) {
          return res.status(400).json({ message: 'Invalid referral_id provided' });
        }
      }

      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Email or phone already exists' });
      }

      const newUser = new User({
        email,
        password,
        fullName,
        phone,
        role,
        referral_id,
        parent_id: parent_id ? parent_id : null,
        permissions: {
          products: {
            create: false,
            edit: false,
            delete: false,
          },
          orders: {
            add: true,
          },
          users: {
            add: false,
            chat: false,
          },
        },
      });

      const savedUser = await newUser.save();
      io.emit('newUserRegistered', { user: savedUser });
      res.status(201).json({ message: 'Affiliate registered successfully', user: savedUser });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

function generateReferralId() {
  return 'referral_' + Math.random().toString(36).substr(2, 9);
}

module.exports = affiliateController;
