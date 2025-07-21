import { Request, Response } from 'express';
import { ResponseService } from "../utils/response";
import { commentModel } from '../models/commentModel';
import { IRequestUser } from '../middleware/authMiddleware';
import { CommentInterface , AddCommentInterface, GetCommentsInterface} from '../types/commentInterface';
import { userModel } from '../models/userModel';
import { blogModel } from '../models/blogModel';

interface IRequestComment extends IRequestUser {
    body: AddCommentInterface;
}

export const getAllComments = async (req: Request, res: Response) => {
    try {
        const comments = await commentModel.find().populate('blog', 'title').populate('user', 'name')

        if (!comments || comments.length === 0) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "No comments found",
                res
            });
        }

        ResponseService<GetCommentsInterface>({
            data: { comments },
            status: 200,
            success: true,
            message: "Comments retrieved successfully",
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
}

export const addComment = async (req: IRequestComment, res: Response) => {
    try {
        const blogId = req.params.id;
        const { message } = req.body;
        const _id = req?.user?._id as string
        const user = await userModel.findOne({
            _id
        })

        const blog = await blogModel.findById(blogId)
        if(!blog) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "Blog not found",
                res
            });
        }

        if (!user) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "User not found",
                res
            });
        }

        const newComment = await commentModel.create({
            blog: blogId,
            user: _id,
            message,
            createdAt: new Date(),
        });

        await blogModel.findByIdAndUpdate(blogId, {
            $push: { comments: newComment._id }
        });

        ResponseService<CommentInterface>({
            data: newComment,
            status: 201,
            success: true,
            message: 'Comment added successfully',
            res
        });
    } catch (error) {
        const { message, stack } = error as Error;
        console.log('Error adding comment:', { message, stack });
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
        
    }
}