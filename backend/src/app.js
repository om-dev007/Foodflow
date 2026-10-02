import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is running properly"
    });
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;