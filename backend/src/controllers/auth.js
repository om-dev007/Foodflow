import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { genOtp } from "../utils/genOtp.js";
import { sendOtpMail } from "../utils/mail.js";

const sanitizeInput = (input) => {
    if (typeof input === "string") {
        return input.trim().toLowerCase();
    }

    return input;
};

export const signUp = async (req, res) => {

    try {
        let { fullName, email, password, mobile, role } = req.body;

        sanitizeInput(fullName);
        sanitizeInput(email);
        sanitizeInput(role);

        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters"
            })
        }

        if (mobile.length < 10) {
            return res.status(400).json({
                message: "Mobile number must be atleast 10 digits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserModel.create({
            fullName,
            email,
            mobile,
            role,
            password: hashedPassword,
        }
        )

        const token = genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });
        return res.status(201).json({
            user
        })
    } catch (err) {
        return res.status(500).json({
            error: err
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        sanitizeInput(email);
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({
                message: "Invalid credentials"
            })
        }

        const token = genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        return res.status(200).json({
            message: "Log out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}

export const sendOtp = async (req, res) => {
    try {
        let { email } = req.body;
        email = email.trim().toLowerCase();
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }

        const otp = genOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();
        sendOtpMail(email, otp);
        return res.status(200).json({
            message: "Otp sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: `Error while sending otp ${error}`
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        let { email, otp } = req.body;
        email = email.trim().toLowerCase();
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }
        if (user.otp != otp) {
            return res.status(404).json({
                message: "Please enter valid otp"
            })
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "Otp expires please resent otp"
            })
        }
        user.isOtpVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({
            message: "Otp verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: `Error while verifying ${error}`
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        let { email, newpassword } = req.body;
        email = email.trim().toLowerCase();
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not found"
            })
        }
        if (!user.isOtpVerified) {
            return res.status(400).json({
                message: "Please verify otp first"
            })
        }
        const hashPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashPassword;
        user.save();
        return res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: `Error while reseting password ${error}`
        })
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body;
        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({ fullName, email, mobile, role })
        }
        user.isOtpVerified = true;
        await user.save();
        const token = genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Google auth error"
        })
    }
}