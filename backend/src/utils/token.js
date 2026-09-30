import jwt from "jsonwebtoken";

const genToken = async (userid) => {
    try {
        const token = await jwt.sign( {
            userid
        } ,process.env.JWT_SECRET, {expiresIn: "7d"})

        return token;
    }
    catch(err) {
        console.log("Error while creating jwt token", err);
    }
}

export default genToken;