import jwt from "jsonwebtoken";

export const genToken = async (id, name) => {
    return await jwt.sign({ id, name }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};