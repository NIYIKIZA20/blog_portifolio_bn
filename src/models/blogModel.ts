import mongoose from "mongoose";
import { BlogInterface } from "../types/blogInterface";

export const blogModelSchema = new mongoose.Schema<BlogInterface>({
    title: String,
    slug: String,
    description: String,
    content: String,
    blog_image_url:String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    isPublished: Boolean,
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "Like"
    }],
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    },
    deletedAt: Date
});
export const blogModel = mongoose.model<BlogInterface>("Blog", blogModelSchema);