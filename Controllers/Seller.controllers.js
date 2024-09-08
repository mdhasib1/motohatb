const User = require('../Models/User.model');
const Store = require('../Models/Store.model');
const sendEmail = require("../utils/Noreply");
const bcrypt = require('bcrypt');
const OTP = require("../Models/SellerOtp");
const jwt = require('jsonwebtoken');
const RefreshToken = require("../Models/Token.model");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const sendOtp = require("./Otp.controllers");
const fetch = require('node-fetch');

const getToken = async () => {
  try {
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        username: process.env.PATHAO_CLIENT_USERNAME,
        password: process.env.PATHAO_CLIENT_PASSWORD,
        grant_type: process.env.PATHAO_CLIENT_GRANT_TYPE,
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to fetch token');
  }
};
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

const SellerController = {
  register: async (req, res, io) => {
    console.log(req.body);
    try {
        const {
            seller_fullName,
            seller_email,
            seller_password,
            seller_business_name,
            seller_zone_id,
            seller_area_id,
            seller_mobile,
            seller_district,
            seller_city,
            seller_thana,
            seller_address,
            seller_postcode,
            latitude, 
            longitude,
          } = req.body;
      

          const existingSeller = await User.findOne({ $or: [{ email:seller_email }, { phone:seller_mobile }] });
          const existingSellerBusinessName = await User.findOne({seller_business_name:seller_business_name });
          if (existingSellerBusinessName) {
            return res.status(400).json({ message: 'Seller Business Name already exists' });
          }
          if (existingSeller) {
            return res.status(400).json({ message: 'Email or phone already exists' });
          }

            const city = seller_city.city_name;
            const district = seller_district.name;
            const thana = seller_thana.name;
            const area_id = seller_area_id.area_id;


            const newSeller = new User({
                fullName: seller_fullName,
                email: seller_email,
                password: seller_password,
                role: 'seller',
            
                seller_business_name: seller_business_name,
                billingAddress: {
                    city,
                    district,
                    thana,
                    postcode: seller_postcode,
                    zone_id: seller_zone_id.zone_id,
                    area_id,
                    union: seller_postcode,
                    address:seller_address,
                    area: seller_postcode
                },
                phone: seller_mobile,
                permissions: {
                    products: {
                        create: true,
                        edit: true,
                        delete: true
                    },
                    orders: {
                        add: true
                    },
                    users: {
                        add: false,
                        chat: false
                    }
                },
                latitude:latitude, 
                longitude:longitude
            });
            

          const savedSeller = await newSeller.save();
          io.emit('savedSellerRegistered', { user: savedSeller });

          const token = await getToken();
          const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/stores`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: seller_business_name,
              contact_name: seller_fullName,
              contact_number: seller_mobile,
              secondary_contact: '',
              address: seller_address,
              city_id: seller_city.city_id, 
              zone_id: seller_zone_id.zone_id,
              area_id: seller_area_id.area_id 
            })
          });
          
          const storeData = await response.json();
          const newStore = new Store({
            seller: savedSeller._id,
            store_id: storeData.data.store_id,
            store_name: storeData.data.store_name
          });
      
          await newStore.save();
      
            const sellerId = savedSeller._id
            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 120000);

            const newOtp = new OTP({
                userId:sellerId,
                code: otp,
                expiresAt: otpExpiresAt,
            });

            await newOtp.save();

            await sendOtp(otp, savedSeller.seller_mobile);

            const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

            const customizedMessage = htmlTemplate.replace('3573', otp); 

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const send_to = savedSeller.email; 
            const emailHeader = 'Welcome to MotoHat!'
            const subject = "OTP for MOTOHAT";
            await sendEmail(
                subject,
                customizedMessage,
                send_to,
                sent_from,
                emailHeader
            );
      res.status(201).json({ message: 'Seller registered successfully', user: savedSeller });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  login: async (req, res, io) => {
    try {
        console.log(req.body)
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });

        console.log(password)

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log(isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.status(201).json({ message: "Login Success", accessToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(401).json({ error: "Invalid credentials or internal server error." });
    }
},

verifyOtp: async (req, res, io) => {
    try {
        const { sellerId, otp } = req.body;
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({ message: "User not found." });
        }
        const storedOtp = await Otp.findOne({
            sellerId,
            code: otp,
            expiresAt: { $gt: new Date() },
        });

        if (!storedOtp) {
            return res.status(401).json({ message: "Invalid OTP or expired." });
        }

        io.emit("otpVerified", { userId: seller._id, status: "verified" });

        res.status(201).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ error: 'Internal server error during OTP verification.' });
    }
},

getSeller: async (req, res, io) => {
    try {
        const { sellerId } = req.params;
        const seller = await User.findById(sellerId);

        if (!seller) {
            return res.status(404).json({ message: "User not found." });
        }
        io.emit('sellerDetails', { seller });

        res.status(201).json({ message: "User found", seller });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error fetching user.' });
    }
},

updateProfile: async (req, res, io) => {
    try {
        const { sellerId } = req.params;
        const updatedProfile = req.body;
        const seller = await Seller.findByIdAndUpdate(sellerId, updatedProfile, { new: true });

        if (!seller) {
            return res.status(404).json({ message: "User not found." });
        }
        io.emit("profileUpdated", seller);

        res.status(200).json({ message: "Profile updated successfully", seller });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ error: 'Internal server error during profile update.' });
    }
},

getUsers: async (req, res, io) => {
    try {
        const sellers = await Seller.find();

        if (!sellers || sellers.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        io.emit('allUsers', { sellers });

        res.status(200).json({ message: "Users found", sellers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error fetching users.' });
    }
},

changePassword: async (req, res, io) => {
    try {
        const seller = await Seller.findById(req.user._id);
        const { oldPassword, password } = req.body;

        if (!oldPassword || !password) {
            res.status(400).json({ message: "Please provide old and new passwords" });
        }

        const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!passwordIsCorrect) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        seller.password = password;
        await seller.save();
        res.status(200).json({ message: "Password changed successfully" });
      } catch (error) {
        console.error('Error during password change:', error);
        res.status(500).json({ error: 'Internal server error during password change.' });
    }
},
sendPasswordResetEmail: async (req, res) => {
  try {
      let seller;
      let send_to;
      const { email, phone } = req.body; 

      if (email) {
          seller = await Seller.findOne({ email });
          send_to = email;
      } else if (phone) {
          seller = await Seller.findOne({ phone });
          send_to = phone;
      } else {
          res.status(400).json({ message: "Email or phone number is required" });
          return;
      }

      if (!user) {
          res.status(404).json({ message: "User does not exist" });
          return;
      }

      let token = await RefreshToken.findOne({ userId: user._id });
      if (token) {
          await token.deleteOne();
      }

      let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

      const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
      
      await new RefreshToken({
          userId: user._id,
          token: hashedToken,
          createdAt: Date.now(),
          expiresAt: Date.now() + 30 * (60 * 1000),
      }).save();

      const resetUrl = `${process.env.FRONTEND_URI}/resetpassword/${resetToken}`;

      let message;
      let subject;
      let sent_from;

      if (email) {
          message = `
              <h2>Hello ${user.fname}</h2>
              <p>Please use the URL below to reset your password.</p>  
              <p>This reset link is valid for only 30 minutes.</p>

              <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

              <p>Regards...</p>
              <p>PAW Team</p>
          `;
          subject = "Password Reset Request";
          sent_from = process.env.EMAIL_USER;
          await sendEmail(subject, message, send_to, sent_from);
      } else if (phone) {
          const otp = await sendOtp(user._id, user.phone);

          message = `Your OTP for password reset is ${otp}`;
          subject = "Password Reset OTP";
          sent_from = process.env.EMAIL_USER;
          console.log("Password Reset OTP:", otp);
      }

      res.status(200).json({ success: true, message: "Reset Instructions Sent" });
  } catch (error) {
      console.error('Error sending password reset instructions:', error);
      res.status(500).json({ success: false, message: "Instructions not sent, please try again" });
  }
},
resendOtp: async (req, res) => {
try {
    const { userId,method } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 120000); 
    await Otp.findOneAndUpdate(
        { userId },
        { code: otp, expiresAt: otpExpiresAt },
        { upsert: true }
    );

    if (method === "phone" && user.phone) {
        await sendOtp(otp, user.phone);
        res.status(200).json({ message: "OTP resent successfully to phone." });
    } else if (method === "email" && user.email) {
        const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
        const customizedMessage = htmlTemplate.replace('3573', otp);
        const sent_from = process.env.EMAIL_USER_NOREPLY;
        const send_to = user.email; 
        const emailHeader = 'Welcome to MotoHat!'
        const subject = "OTP for MOTOHAT";
        await sendEmail(
            subject,
            customizedMessage,
            send_to,
            sent_from,
            emailHeader
        );
        
        res.status(200).json({ message: "OTP resent successfully to email." });
    } else {
        res.status(400).json({ message: "User has no phone or email specified." });
    }
} catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Internal server error resending OTP.' });
}
},
getStores: async (req, res) => {
try {
    const token = await getToken();
    const response = await fetch(`${process.env.PATHAO_API_ENDPOINT}/aladdin/api/v1/stores`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const storeData = await response.json();
    res.status(200).json({ message: "All Stores get successfully", storeData });

} catch (error) {
    
}
}
};


module.exports = SellerController;
