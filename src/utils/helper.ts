import mongoose from "mongoose";
import { config } from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

config()

const url = process.env.URL

export const connectDB = async () => {
    try {
        if(!url) {
            console.log("mongo url not found")
            return
        }
        await mongoose.connect(url);
        console.log("connected to mongoDB")
    } catch (error) {
        console.log("Failed to connect to the mongoDB", error)
    }
}

export const generateSlug = (title: string): string => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const secretKey = process.env.JWT_SECRET || "SecretKey";

export const generateToken = ({_id, email, role}: { _id: string; email: string; role: string }): string => {
    return jwt.sign({ _id, email, role }, secretKey, { expiresIn: '5h' });
}