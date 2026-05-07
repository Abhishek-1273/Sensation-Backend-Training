import jwt from "jsonwebtoken";

export const genToken = async (id, name, role) => {
    return await jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};