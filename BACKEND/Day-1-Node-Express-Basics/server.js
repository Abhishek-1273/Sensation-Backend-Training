// 1. DATEBASE
// Yaha database connection hota hai (MongoDB etc.)

// 2. SERVER START
// Yaha server ko run karte hain (listen on port)

// console.log("running"); 
// check karne ke liye ki server file run ho rahi hai

// 3. PORT CONFIGURATION
// Server kis port pe chalega (jaise 3000, 5000)

// 4. ERROR HANDLING (basic level pe)
// Agar server start me error aaye toh handle karte hain

// NOTE:
// nodemon use hota hai auto-restart ke liye jab file change ho

// TERMINAL COMMAND:
// npm i nodemon

// Scripts (commands jo tu run karega)
//   "scripts": {
//     "start": "node server.js",     // normal start
//     "dev": "nodemon server.js"    // development ke liye (auto restart)
//   },

// ------------------------------------------------------------------------------------------------------- 

// -------------------- IMPORT --------------------
import app from "./app.js";   // ⚠️ extension likhna zaroori hai

// -------------------- PORT --------------------
const port = process.env.PORT || 3000;

// -------------------- SERVER START --------------------
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});