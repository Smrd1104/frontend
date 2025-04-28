// controllers/passwordController.js
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStorage = new Map();

async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) throw new Error("Email is required");

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        // Store OTP with expiry
        otpStorage.set(email, { otp, otpExpiry });

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `
        };

        await transporter.sendMail(mailOptions);

        // Generate temporary token for OTP verification step
        const tempToken = jwt.sign(
            { email },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '10m' }
        );

        res.cookie('tempToken', tempToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });

        return res.status(200).json({
            message: "OTP sent to email",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}

async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) throw new Error("Email and OTP are required");

        const storedOtpData = otpStorage.get(email);
        if (!storedOtpData) {
            return res.status(400).json({
                message: "OTP expired or not generated",
                success: false,
                error: true
            });
        }

        if (storedOtpData.otpExpiry < Date.now()) {
            otpStorage.delete(email);
            return res.status(400).json({
                message: "OTP expired",
                success: false,
                error: true
            });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
                error: true
            });
        }

        // OTP verified successfully
        otpStorage.delete(email);

        // Generate reset token
        const resetToken = jwt.sign(
            { email },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '15m' }
        );

        res.cookie('resetToken', resetToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.status(200).json({
            message: "OTP verified successfully",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}

// Change the resetPassword function to verify the resetToken instead of using authToken
async function resetPassword(req, res) {
    try {
        const { newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword) {
            throw new Error("New password and confirm password are required");
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false,
                error: true
            });
        }

        // Get reset token from cookie
        const resetToken = req.cookies?.resetToken;
        if (!resetToken) {
            return res.status(401).json({
                message: "Reset token missing or expired",
                success: false,
                error: true
            });
        }

        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.TOKEN_SECRET_KEY);
        const email = decoded.email;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Clear reset token cookie
        res.clearCookie('resetToken');

        return res.status(200).json({
            message: "Password reset successful",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    resetPassword
};