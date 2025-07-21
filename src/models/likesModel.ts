import mongoose from "mongoose";
import { LikeInterface } from "../types/likesInterface";

export const likeModelSchema = new mongoose.Schema<LikeInterface>({
    blog: {
        type: mongoose.Types.ObjectId,
        ref: "Blog"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

export const likeModel = mongoose.model<LikeInterface>("Like", likeModelSchema);
