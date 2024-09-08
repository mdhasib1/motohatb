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
            } else {
                console.warn('Admin user not found. Skipping notification.');
            }

            io.emit("newUserRegistered", { user: savedUser });

            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 30000);


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
            await sendEmail(
                subject,
                customizedMessage,
                send_to,
                sent_from,
                emailHeader
            );

            res.status(201).json({ message: "User registered successfully", userId: savedUser._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    login: async (req, res, io) => {
        console.log(req.body);
        try {
            const { phone, password } = req.body;
            const user = await User.findOne({ phone });

            console.log(user);

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
            await linkChatsToUser(phone, user._id);
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

            user.password = await bcrypt.hash(password, 10);
            await user.save();
            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error('Error during password change:', error);
            res.status(500).json({ error: 'Internal server error during password change.' });
        }
    },

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
            const expiresAt = Date.now() + 15 * (60 * 1000);

            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            await RefreshToken.create({ userId: user._id, token: hashedToken, expiresAt });

            const resetURL = `${process.env.FRONTEND_URL}/auth/resetPassword/${resetToken}`;
            const templatePath = path.join(__dirname, '..', 'Email', 'reset.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
            const customizedMessage = htmlTemplate.replace('ResetURL', resetURL);

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const subject = 'Password Reset Request';
            await sendEmail(subject, customizedMessage, send_to, sent_from, 'Password Reset Request');

            res.status(200).json({ message: 'Password reset email sent', resetToken });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ error: 'Internal server error sending password reset email.' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { resetToken } = req.params;
            const { password } = req.body;

            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const token = await RefreshToken.findOne({ token: hashedToken, expiresAt: { $gt: Date.now() } });

            if (!token) {
                return res.status(400).json({ message: 'Invalid or expired reset token.' });
            }

            const user = await User.findById(token.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            user.password = await bcrypt.hash(password, 10);
            await user.save();

            await RefreshToken.deleteOne({ _id: token._id });

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ error: 'Internal server error resetting password.' });
        }
    },

    resendOtp: async (req, res) => {
        try {
            const { phone } = req.body;
            console.log(phone)
            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const existingOtp = await Otp.findOne({ userId: user._id });
            if (existingOtp) {
                await existingOtp.deleteOne();
            }

            const otp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + 120000);

            const newOtp = new Otp({
                userId: user._id,
                code: otp,
                expiresAt: otpExpiresAt,
            });

            await newOtp.save();
            await sendOtp(otp, user.phone);

            const templatePath = path.join(__dirname, '..', 'Email', 'otp.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
            const customizedMessage = htmlTemplate.replace('3573', otp);

            const sent_from = process.env.EMAIL_USER_NOREPLY;
            const send_to = user.email;
            const subject = 'OTP for MOTOHAT';
            const emailHeader = 'OTP Resend Request';
            await sendEmail(subject, customizedMessage, send_to, sent_from, emailHeader);

            res.status(200).json({ message: 'OTP resent successfully' });
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(500).json({ error: 'Internal server error resending OTP.' });
        }
    },
};

module.exports = userController;
