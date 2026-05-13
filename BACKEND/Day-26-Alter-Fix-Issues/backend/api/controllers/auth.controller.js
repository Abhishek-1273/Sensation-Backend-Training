import { genToken } from "../../utils/genToken.js";
import { Auth } from "../models/auth.schema.js";

export const signup = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;
        if (!userName || !password || !email) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const isUserExist = await Auth.findOne({ email: email });
        if (isUserExist) {
            return res.status(400).json({
                message: "Email is already exist",
            });
        }
        const user = await Auth.create({
            email,
            userName,
            password,
            role: req.body.role || "user"
        });

        return res.status(201).json({
            message: "Registered successfully",
            data: user._id,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }
        const user = await Auth.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }

        // TOKEN GENERATION

        const token = await genToken(user._id, user.userName, user.role);

        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })
            .status(200).json({
                message: "Signin Successfully",
                data: {
                    _id: user._id,
                    name: user.userName,
                    role: user.role
                }
            })


    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

export const getuser = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

export const signout = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({
            message: "Signout successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
