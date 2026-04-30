import app from "./app.js";
import { db } from "./config/db.js";

// -------------------- CONFIG --------------------
const PORT = process.env.PORT || 3000;

// -------------------- DATABASE --------------------
// MongoDB Atlas → cloud database
// MongoDB Compass → local system database

db(); // database connect

// -------------------- SERVER START --------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});