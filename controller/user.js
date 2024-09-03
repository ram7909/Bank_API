import { User } from "../Model/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Random Account Number Generator
export const generateAccountNumber = async () => {
    let accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return accountNumber;
}

// Sign Up
export const signUp = async (req, res) => {
    const { name, email, phone, PAN, aadhar, accountType, password } = req.body;
    try {
        let user = await User.findOne({
            $or: [
                { email },
                { phone },
                { PAN },
                { aadhar }
            ]
        });

        if (user) {
            return res.json({ message: "User Already Exists", success: false });
        }

        const accountNumber = await generateAccountNumber();
        let hashPassword = await bcrypt.hash(password, 10)
        user = await User.create({ name, email, phone, PAN, aadhar, accountNumber, accountType, password: hashPassword });

        res.json({ message: "Sign Up Success", user, success: true });
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false });
    }
}

// Sign In
export const signIn = async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) return res.json({ message: "User Not Exist", success: false })

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({ message: "Invalid Credentials", success: false })

        var token = jwt.sign({ userId: user._id }, process.env.JWT_Secret);
        res.json({ message: `Welcome ${user.name}`, token, success: true })
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false });
    }
}

// Profile
export const profile = async (req, res) => {
    const token = req.header("auth")
    try {
        if (!token) return res.json({ message: "Login First", success: false })
        var decoded = jwt.verify(token, process.env.JWT_Secret);
        const id = decoded.userId

        let user = await User.findById(id)
        const { accountNumber, balance, name, _id, accountType } = user

        res.json({ message: `Welcome ${user.name}`, _id, name, accountNumber, accountType, balance, success: true })
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false })
    }
}

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User does not exist", success: false });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        await user.save();

        res.json({ message: "Password updated successfully", success: true });
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false })
    }
}
