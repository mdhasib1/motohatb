const User = require("../Models/User.model");

const affiliateController = {
  register: async (req, res, io) => {
    try {
      const { email, password, fullName, phone } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or phone already exists" });
      }

      const newUser = new User({
        email,
        password,
        fullName,
        phone,
        permissions: {
          orders: {
            add: true,
          },
        },
      });

      const savedUser = await newUser.save();
      io.emit("newUserRegistered", { user: savedUser });
      res
        .status(201)
        .json({
          message: "Affiliate registered successfully",
          user: savedUser,
        });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

function generateReferralId() {
  return "referral_" + Math.random().toString(36).substr(2, 9);
}

module.exports = affiliateController;
