import mongoose from "mongoose";
import { UserInterface} from "../types/userInterface";


export const userModelSchema = new mongoose.Schema<UserInterface>({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    isActive: Boolean,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

export const userModel = mongoose.model<UserInterface>("User", userModelSchema);
