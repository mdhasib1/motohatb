const bcrypt = require("bcrypt");
const User = require('../Models/User.model');
const BankDetails = require('../Models/bankDetails.model');
const MobileBanking = require('../Models/mobileBanking.model');
const ReferralLink = require('../Models/referralLink.model');
const Withdrawal = require('../Models/withdrawal.model');
const jwt = require('jsonwebtoken');

const affiliateController = {
  register: async (req, res) => {
    try {
      const { email, password, fullName, phone } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: "Email or phone already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: 'affiliator',
        totalEarnings: 0,
      });

      const savedUser = await newUser.save();
      return res.status(201).json({ message: "Affiliate registered successfully", user: savedUser });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Login affiliate user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists and is an affiliator
      if (!user || user.role !== 'affiliator') {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ message: "Login successful", accessToken });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  trackReferral: async (req, res) => {
    try {
      const { refCode, productId } = req.body;

      const referralLink = await ReferralLink.findOne({ link: { $regex: refCode } });
      if (!referralLink) {
        return res.status(404).json({ message: "Referral link not found" });
      }

      referralLink.clicks += 1; 

      if (productId) {
        referralLink.successfulPurchases += 1; 
      }

      await referralLink.save();

      return res.status(200).json({ message: "Referral tracked successfully" });
    } catch (error) {
      console.error("Error tracking referral:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  addBankDetails: async (req, res) => {
    try {
      const { method, details } = req.body;
      const userId = req.user.id;

      if (method === 'mobileBanking') {
        const mobileBanking = new MobileBanking({ ...details, userId });
        await mobileBanking.save();
        return res.status(200).json({ message: "Mobile banking details added successfully" });
      } else if (method === 'banking') {
        const bankDetails = new BankDetails({ ...details, userId });
        await bankDetails.save();
        return res.status(200).json({ message: "Bank details added successfully" });
      } else {
        return res.status(400).json({ message: "Invalid method" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  generateReferralLink: async (req, res) => {
    try {
      const { productId } = req.body;
      const affiliatorId = req.user.id;

      const referralId = "referral_" + Math.random().toString(36).substr(2, 9);
      const referralLink = `${req.protocol}://${req.get('host')}/product/${productId}?ref=${referralId}`;

      const newReferralLink = new ReferralLink({
        affiliatorId,
        link: referralLink,
        product: productId,
      });

      await newReferralLink.save();
      return res.status(201).json({ message: "Referral link generated successfully", link: referralLink });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  requestWithdrawal: async (req, res) => {
    try {
      const { amount, method } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (amount > user.totalEarnings) {
        return res.status(400).json({ message: "Insufficient earnings" });
      }

      let details;
      if (method === 'mobileBanking') {
        const mobileDetails = await MobileBanking.findOne({ userId });
        if (!mobileDetails) {
          return res.status(400).json({ message: "No mobile banking details found" });
        }
        details = mobileDetails;
      } else if (method === 'banking') {
        const bankDetails = await BankDetails.findOne({ userId });
        if (!bankDetails) {
          return res.status(400).json({ message: "No bank details found" });
        }
        details = bankDetails;
      } else {
        return res.status(400).json({ message: "Invalid method" });
      }

      const withdrawal = new Withdrawal({
        affiliator: userId,
        method,
        amount,
        details,
      });

      await withdrawal.save();
      return res.status(200).json({ message: "Withdrawal request submitted successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = affiliateController;
