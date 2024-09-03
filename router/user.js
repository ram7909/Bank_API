import express from "express";
import { forgotPassword, profile, signIn, signUp } from "../controller/user.js";
import { authenticate } from "../Middleware/auth.js";
const router = express.Router();

// Sign Up
router.post("/signup",signUp)

// Sign In
router.post('/signIn',signIn)

// Profile
router.get('/profile',authenticate,profile)

// Update Password
router.put('/updatepassword',forgotPassword)



export default router