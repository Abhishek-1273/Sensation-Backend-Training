import frameworkModel from "../models/framework.model.js";

const framework = async(req, res) => {
    try{
        const {name} = req.body;

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}