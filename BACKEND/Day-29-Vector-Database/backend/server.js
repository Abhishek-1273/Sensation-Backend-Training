import app from "./app.js";
import { db } from "./config/db.js";
import './config/qdrant.js'

// -------------------- CONFIG --------------------
const PORT = process.env.PORT || 3000;

// -------------------- DATABASE --------------------
db(); 

// -------------------- SERVER START --------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});