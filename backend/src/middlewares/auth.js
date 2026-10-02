import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
    console.log("ALL COOKIES:", req.cookies);
    console.log("COOKIE HEADER:", req.headers.cookie);

    const {Token} = req.headers.cookie;
    console.log("Token outer: ", Token);

    try {
        const token = req.cookies?.token;

        console.log("TOKEN:", token);

        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            });
        }

        const decodeToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decodeToken.userId;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};