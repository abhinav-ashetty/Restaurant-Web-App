
//promise<void> is used to indicate that this function returns a promise that resolves to void, meaning it does not return any value. This is useful for asynchronous functions that perform some operations but do not need to return any data to the caller.

import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/auth.js";


// helper to generate he  JWT token
const generateToken = (userId: string): string => {
    // Generate a JWT token using the user ID and a secret key from environment variables.
    // The token will expire in 30 days.
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
}


// Register a new user
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name,email,password,phone,role} = req.body;

        if(!name || !email || !password || !phone){
            res.status(400).json({message: "Please fill all the fields"});
            return;
        }
        const userExists = await User.findOne({email});
        // check if user exists, if yes then return  message, else create new user
        if(userExists){
            res.status(400).json({message: "User already exists"});
            return;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        if(user){
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user.id.toString())
            });
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }

    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

// Authenticate user and get token
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name,email,password,phone,role} = req.body;

        if(!email || !password){
            res.status(400).json({message: "Please fill all the fields"});
            return;
        }
        const user = await User.findOne({email});
        // check if user exists, if yes then return  message, else create new user
        if(!user){
            res.status(401).json({message: "Invalid email and Password"});
            return;
        }
        
        // Check if passwords matched
        const isPasswordMatched = await bcrypt.compare(password, user.password!);
        if(!isPasswordMatched){
            res.status(401).json({message: "Invalid email and Password"});
            return;
        }
        res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user.id.toString())
            });
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

// Get user profile
// GET /api/auth/me
// @access Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user){
            res.status(401).json({message: "Not authorized"});
            return;
        }
        res.json(req.user);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({message: "Server error"});
    }
}