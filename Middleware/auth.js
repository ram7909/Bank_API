import jwt from "jsonwebtoken"
import { User } from "../Model/user.js";

export const authenticate = async (req, res, next) => {
    const token = req.header("auth")
    try {
        if (!token) return res.json({ message: "Login First", success: false })

        var decoded = jwt.verify(token, process.env.JWT_Secret);
        const id = decoded.userId

        let user = await User.findById(id)
        if (!user) return res.json({ message: "User Not Found", success: false })
        req.user = user
        next();
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false })
    }
}