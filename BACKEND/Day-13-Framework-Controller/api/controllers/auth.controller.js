import { genToken } from "../../utils/genToken.js";
import { Auth } from "../models/auth.model.js";

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
            role: "user"
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

        const token = await genToken(user._id, user.userName);

        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })
            .status(200).json({
                message: "Signin Successfully",
                data: user._id,
            })


    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}
