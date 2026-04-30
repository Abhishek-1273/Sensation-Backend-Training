import express from "express"
import dotenv from "dotenv"

dotenv.config();

const app = express();

// ----------------- Middleware ------------------

app.get("/test/:id", (req, res, next) => {
    console.log(req.params.id)
    console.log(req.query.name)
    res.status(200).json({
        message: " My first server response "
    });
});

// ------------------- Routes --------------------


export default app;

// http://localhost:5000/test/1?name=abhi