const User = require("../Models/User.model");
const sendOtp = require("./Otp.controllers");
const bcrypt = require("bcrypt");
const Otp = require("../Models/Otp.model");
const jwt = require('jsonwebtoken');
const RefreshToken = require("../Models/RefreshToken.model");
const crypto = require("crypto");
const sendEmail = require("../Utils/Noreply");
const OTP = require('../Models/Otp.model');
const fs = require('fs');
const path = require('path');

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

const userController = {
    register: async (req, res, io) => {
        try {
            const { email, password, fullName, phone } = req.body;

            const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
            if (existingUser) {
                return res.status(400).json({ message: "Email or phone already exists" });
            }

            const newUser = new User({
                email,
                password,
                fullName,
                phone
            });

            const savedUser = await newUser.save();

            io.emit("newUserRegistered", { user: savedUser });
            const userId = savedUser._id
            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 120000);

            const newOtp = new OTP({
            userId,
            code: otp,
            expiresAt: otpExpiresAt,
            });

            await newOtp.save();

            const otppass = await sendOtp(otp, savedUser.phone);

            const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

            const customizedMessage = htmlTemplate.replace('3573', otp); 

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const send_to = savedUser.email; 
            const emailHeader = 'Welcome to MotoHat!'
            const subject = "OTP for MOTOHAT";
            await sendEmail(
                subject,
                customizedMessage,
                send_to,
                sent_from,
                emailHeader
            );

            res.status(201).json({ message: "User registered successfully", userId: savedUser._id, otppass });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },


    

    login: async (req, res, io) => {
        try {
            const { phone, password } = req.body;
            const user = await User.findOne({ phone });

            console.log(phone)

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

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
            const { userId, otp } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            const storedOtp = await Otp.findOne({
                userId,
                code: otp,
                expiresAt: { $gt: new Date() },
            });

            if (!storedOtp) {
                return res.status(401).json({ message: "Invalid OTP or expired." });
            }

            io.emit("otpVerified", { userId: user._id, status: "verified" });

            res.status(201).json({ message: "OTP verified successfully" });
        } catch (error) {
            console.error('Error during OTP verification:', error);
            res.status(500).json({ error: 'Internal server error during OTP verification.' });
        }
    },

    getUser: async (req, res, io) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            io.emit('userDetails', { user });

            res.status(201).json({ message: "User found", user });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error fetching user.' });
        }
    },

    updateProfile: async (req, res, io) => {
        try {
            const { userId } = req.params;
            const updatedProfile = req.body;
            const user = await User.findByIdAndUpdate(userId, updatedProfile, { new: true });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            io.emit("profileUpdated", user);

            res.status(200).json({ message: "Profile updated successfully", user });
        } catch (error) {
            console.error('Error during profile update:', error);
            res.status(500).json({ error: 'Internal server error during profile update.' });
        }
    },

    getUsers: async (req, res, io) => {
        try {
            const users = await User.find();

            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }

            io.emit('allUsers', { users });

            res.status(200).json({ message: "Users found", users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error fetching users.' });
        }
    },

    changePassword: async (req, res, io) => {
        try {
            const user = await User.findById(req.user._id);
            const { oldPassword, password } = req.body;

            if (!oldPassword || !password) {
                res.status(400).json({ message: "Please provide old and new passwords" });
            }

            const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

            if (!passwordIsCorrect) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }

            user.password = password;
            await user.save();
            res.status(200).json({ message: "Password changed successfully" });
          } catch (error) {
            console.error('Error during password change:', error);
            res.status(500).json({ error: 'Internal server error during password change.' });
        }
    },
    sendPasswordResetEmail: async (req, res) => {
      try {
          let user;
          let send_to;
          const { email, phone } = req.body; 

          if (email) {
              user = await User.findOne({ email });
              send_to = email;
          } else if (phone) {
              user = await User.findOne({ phone });
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
}
};

module.exports = userController;
