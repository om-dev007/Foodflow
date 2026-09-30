import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();
import connnectDb from "./src/config/db.js";

const port = process.env.PORT || 8000;

app.listen(port, () => {
    connnectDb();
    console.log(`Server is running on port ${port}...`)
})