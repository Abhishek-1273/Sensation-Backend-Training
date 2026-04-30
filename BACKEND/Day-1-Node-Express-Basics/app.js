// 1. MIDDLEWARE
// Middleware vo functions hote hain jo request aur response ke beech me run hote hain

// 2. CONFIGURATION
// App ki settings yaha define hoti hain

// 3. ROUTES
// Routes define karte hain ki kaunsa URL kya response dega

// FLOW:
// Request → Middleware → Route → Response

// npm init -y → Project initialize karne ke liye terminal me run kare
// npm install express → express install karne ke liye
// npm install dotenv → Environment variables use karne ke liye (dotenv)

// ------------------------------------------------------------------------------------------------------------------------------

// -------------------- IMPORT --------------------
import express from "express";
import dotenv from "dotenv";

// -------------------- CONFIGURATION --------------------
dotenv.config();
// .env file ko load karta hai 

// -------------------- APP INIT --------------------
const app = express();

// -------------------- EXPORT --------------------
export default app;