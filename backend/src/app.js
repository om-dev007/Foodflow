import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.status(200).json({
        Message: "Server is running properly"
    })
})

app.use("/api/auth", authRouter);

export default app;