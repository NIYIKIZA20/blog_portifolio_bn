import mongoose from "mongoose";
import { CommentInterface } from "../types/commentInterface";

export const commentModelSchema = new mongoose.Schema<CommentInterface>({
    blog: {
        type: mongoose.Types.ObjectId,
        ref: "Blog"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
    }
});

export const commentModel = mongoose.model<CommentInterface>("Comment", commentModelSchema);
