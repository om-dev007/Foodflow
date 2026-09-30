import mongoose from "mongoose"

const connnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Db connnected successfully");
    }
    catch(err) {
        console.log("Error while connecting to db", err);
    }
}

export default connnectDb;