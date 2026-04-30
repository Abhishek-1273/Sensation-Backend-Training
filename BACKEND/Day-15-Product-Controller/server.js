import app from "./app.js";
import { db } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// -------------------- CONFIG --------------------
const PORT = process.env.PORT || 3000;

// -------------------- DATABASE --------------------
db(); 

cloudinary.api.ping().then(r => console.log("✅ Cloudinary connected:", r)).catch(e => console.log("❌ Cloudinary error:", e.message));


// -------------------- SERVER START --------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});