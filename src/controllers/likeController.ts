import { Request, Response } from 'express';
import { ResponseService } from "../utils/response";
import { likeModel } from '../models/likesModel';
import { IRequestUser } from '../middleware/authMiddleware';
import { blogModel } from '../models/blogModel';
import { LikeInterface, AddLikeInterface, GetLikesInterface } from '../types/likesInterface';

interface IRequestLike extends IRequestUser {
    body: AddLikeInterface;
}

export const addLike = async (req: IRequestLike, res: Response) => {
    try {
        const blog = req.params.id;
        const _id = req?.user?._id as string

        if (!blog) {
            return ResponseService({
                data: null,
                success: false,
                message: 'Blog ID is required',
                status: 400,
                res
            });
        }
        const existingLike = await likeModel.findOne({ blog: blog, user: _id });

        if (existingLike) {
            return ResponseService({
                data: null,
                success: false,
                message: 'You have already liked this blog',
                status: 400,
                res,
            });
        }

        const newLike = await likeModel.create({
            blog: blog,
            user: _id
        });

        await blogModel.findByIdAndUpdate(blog, {
            $push: { likes: newLike._id }
        });

        return ResponseService<LikeInterface>({
            data: newLike,
            status: 201,
            success: true,
            message: "like added successfully",
            res
        });
    } catch (error) {
        const { message, stack } = error as Error;
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};
