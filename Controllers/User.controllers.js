const User = require("../Models/User.model");
const sendOtp = require("./Otp.controllers");
const bcrypt = require("bcrypt");
const Otp = require("../Models/Otp.model");
const jwt = require('jsonwebtoken');
const RefreshToken = require("../Models/Token.model");
const crypto = require("crypto");
const sendEmail = require("../utils/Noreply");
const fs = require('fs');
const path = require('path');
const Notification = require('../Models/Notification.model');
const Chat = require('../Models/Chat.model');


const linkChatsToUser = async (phone, userId) => {
    await Chat.updateMany(
        { temporaryId: phone },
        { $set: { senderId: userId }, $unset: { temporaryId: "" } }
    );
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * User Controller
 * 
 * This controller handles user-related operations such as registration, login, OTP verification, profile updates, 
 * password reset, and fetching user details.
 * 
 * @namespace userController
 * 
 * @property {function} register - Registers a new user, sends OTP, and notifies admin.
 * @property {function} login - Authenticates a user and returns an access token.
 * @property {function} verifyOtp - Verifies the OTP for a user.
 * @property {function} resendOtp - Resends the OTP to the user via email or phone.
 * @property {function} updateProfile - Updates the user's profile information.
 * @property {function} sendPasswordResetEmail - Sends a password reset email to the user.
 * @property {function} resetPassword - Resets the user's password using a token.
 * @property {function} getOtpExpirationTime - Retrieves the remaining time for OTP expiration.
 * @property {function} getUsers - Fetches all users.
 * @property {function} getUser - Fetches a single user by ID.
 */
const userController = {

    register: async (req, res, io) => {
        try {
            const { email, password, fullName, phone, latitude, longitude } = req.body;
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
                latitude,
                longitude,
            });
            const savedUser = await newUser.save();
            await linkChatsToUser(savedUser.phone, savedUser._id);
            const adminUser = await User.findOne({ role: 'admin' });
            if (adminUser) {
                const newNotification = new Notification({
                    message: `🎉 New user registered: ${savedUser.fullName} has joined our platform. Welcome aboard! 🚀`,
                    userId: adminUser._id,
                    read: false
                });
                await newNotification.save();
                io.emit('newNotification', newNotification);
            }

            io.emit("newUserRegistered", { user: savedUser });

            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 300000); 
            const newOtp = new Otp({
                userId: savedUser._id,
                code: otp,
                expiresAt: otpExpiresAt,
            });
            await newOtp.save();

            await sendOtp(otp, savedUser.phone);

            const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
            const customizedMessage = htmlTemplate.replace('3573', otp); 

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const send_to = savedUser.email;
            const emailHeader = 'Welcome to MotoHat!';
            const subject = "OTP for MOTOHAT";
            await sendEmail(subject, customizedMessage, send_to, sent_from, emailHeader);

            res.status(201).json({ message: "User registered successfully", userId: savedUser._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // User login handler
    login: async (req, res, io) => {
        try {
            const { phone, password } = req.body;
            const user = await User.findOne({ phone });

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
                { expiresIn: "1h" }
            );

            await linkChatsToUser(phone, user._id);

            res.status(200).json({ message: "Login Success", accessToken });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(401).json({ error: "Invalid credentials or internal server error." });
        }
    },

    // OTP verification handler
    verifyOtp: async (req, res, io) => {
        console.log(req.body)
        try {
            const { userId, otp } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const storedOtp = await Otp.findOne({
                userId,
                code: otp,
                expiresAt: { $gt: new Date() }, // Ensure OTP is still valid
            });
            if (!storedOtp) {
                return res.status(401).json({ message: "Invalid OTP or expired." });
            }
            console.log(storedOtp)
            io.emit("otpVerified", { id: userId, isVerified: "verified" });
            res.status(200).json({ message: "OTP verified successfully" });
        } catch (error) {
            console.error('Error during OTP verification:', error);
            res.status(500).json({ error: 'Internal server error during OTP verification.' });
        }
    },

    resendOtp: async (req, res) => {
        try {
            const { userId, method } = req.body;
    
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
    
            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 300000); // OTP valid for 5 minutes
            const newOtp = new Otp({
                userId,
                code: otp,
                expiresAt: otpExpiresAt
            });
            await newOtp.save();
    
            if (method === "email") {
                const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
                const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
                const customizedMessage = htmlTemplate.replace('3573', otp); // Replace dummy OTP with actual OTP
    
                const sent_from = process.env.EMAIL_USER_NOREPLY;
                const send_to = user.email;
                const emailHeader = 'MotoHat OTP';
                const subject = "Your OTP Code";
    
                await sendEmail(send_to, subject, customizedMessage, sent_from, emailHeader);
            } else if (method === "phone") {
                await sendOtp(otp, user.phone);
            }
    
            res.status(200).json({ message: "OTP resent successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },
    // Profile update handler
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

    // Password reset request handler
    sendPasswordResetEmail: async (req, res) => {
        try {
            const { email, phone } = req.body;
            let user, send_to;

            if (email) {
                user = await User.findOne({ email });
                send_to = email;
            } else if (phone) {
                user = await User.findOne({ phone });
                send_to = user.email;
            } else {
                return res.status(400).json({ message: 'Please provide an email or phone number.' });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const expiresAt = Date.now() + 15 * (60 * 1000); // Token valid for 15 minutes

            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            await RefreshToken.create({ userId: user._id, token: hashedToken, expiresAt });

            const resetURL = `${process.env.PASSWORD_RESET_URL}/${resetToken}`;

            const templatePath = path.join(__dirname, '..', 'Email', 'resetPassword.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
            const customizedMessage = htmlTemplate.replace('RESET_LINK', resetURL);

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const emailHeader = 'Reset Your Password';
            const subject = 'Password Reset Link';
            await sendEmail(subject, customizedMessage, send_to, sent_from, emailHeader);

            res.status(200).json({ message: 'Password reset link sent successfully.' });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const resetToken = await RefreshToken.findOne({
                token: hashedToken,
                expiresAt: { $gt: Date.now() },
            });

            if (!resetToken) {
                return res.status(400).json({ message: 'Invalid or expired token.' });
            }

            const user = await User.findById(resetToken.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();

            await resetToken.deleteOne();

            res.status(200).json({ message: 'Password reset successfully.' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },
    getOtpExpirationTime: async (req, res,io) => {
        try {
            const { userId } = req.params;
        
            const otpRecord = await Otp.findOne({ userId }).sort({ createdAt: -1 });
        
            if (!otpRecord) {
              return res.status(404).json({ message: "OTP not found." });
            }
        
            const currentTime = new Date();
            const timeRemaining = otpRecord.expiresAt - currentTime;
        
            if (timeRemaining <= 0) {
              return res.status(400).json({ message: "OTP has expired." });
            }
        
            res.status(200).json({ remainingTime: timeRemaining / 1000 }); // Return time in seconds
          } catch (error) {
            console.error("Error fetching OTP time:", error);
            res.status(500).json({ message: "Internal server error." });
          }
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userController;
