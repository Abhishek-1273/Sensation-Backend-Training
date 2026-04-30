// ORM → Object Relational Mapping (SQL databases ke liye)
// ODM → Object Data Modeling (MongoDB ke liye)

// Terminal Command:
// npm install mongoose


import mongoose from "mongoose";


// -------------------- DATABASE CONNECTION --------------------
export const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected ✅");
    } catch (error) {
        console.log("Database connection failed ❌:", error.message);
        process.exit(1); // app band kar deta hai agar DB connect na ho
    }
};