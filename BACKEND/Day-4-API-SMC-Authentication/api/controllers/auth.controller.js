import { Auth } from "../models/auth.schema.js";

export const signup = async (req, res, next) => {
    try{
        const {userName, email, password, role} = req.body;
        if (!userName || !password || !email){
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const isUserExist = await Auth.findOne({ email: email});
        if(isUserExist){
            return res.status(400).json({
                message: "Email is already exist",
            });
        }
        const user = await Auth.create({
            email,
            userName,
            password,
            role,
        });

        return res.status(201).json({
            message: "Registered successfully",
            data: user._id,
        });
    }catch(err){
        return res.status(500).json({
            message: err.message,
        });
    }
}