import mongoose from "mongoose";

export interface LikeInterface {
    blog: { type: typeof mongoose.Types.ObjectId; ref: string; }
    user: { type: typeof mongoose.Types.ObjectId; ref: string; }
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface AddLikeInterface extends Omit<LikeInterface, 'createdAt' | 'updatedAt'> {}
export interface GetLikesInterface {
    likes: LikeInterface[];
}