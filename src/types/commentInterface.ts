import mongoose from "mongoose";

export interface CommentInterface {
    blog: { type: typeof mongoose.Types.ObjectId; ref: string; }
    user: { type: typeof mongoose.Types.ObjectId; ref: string; }
    message: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface AddCommentInterface extends Omit<CommentInterface, 'createdAt' | 'updatedAt'> {}
export interface GetCommentsInterface {
    comments: CommentInterface[];
}