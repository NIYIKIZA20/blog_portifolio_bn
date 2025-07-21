import { Request, Response } from 'express';
import { ResponseService } from "../utils/response";
import { GetAllBlogs, interfaceAddBlog, BlogInterface } from '../types/blogInterface';
import { blogModel } from '../models/blogModel';
import { userModel } from '../models/userModel';
import { generateSlug } from '../utils/helper';
import { IRequestUser } from '../middleware/authMiddleware';
import { uploadFile } from '../utils/upload';


interface IRequestBlog extends IRequestUser {
    body: interfaceAddBlog;
}

export const getAllBlogs = async (req: Request, res: Response) => {
    try {
       
        const blogs = await blogModel.find().populate('author','name').populate({
            path: 'comments',
            select: 'message user',
            populate: {
                path: 'user',
                select: 'name'
            }
        })

        if (!blogs || blogs.length === 0) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "No blogs found",
                res
            });
        }

        ResponseService<GetAllBlogs>({
            data: { blogs },
            status: 200,
            success: true,
            message: "Blogs retrieved successfully",
            res
        });
    } catch (err) {
        const { message, stack } = err as Error;
        console.error('Error getting all blogs:', { message, stack });
        
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};

export const getBlog = async (req: Request, res: Response) => {
    try {
        const blog = await blogModel.findOne({ _id: req.params.id });

        if(!blog) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "Blog not found",
                res
            });
        }

        ResponseService<BlogInterface>({
            data: blog,
            status: 200,
            success: true,
            message: "Blog retrieved successfully",
            res
        });
    } catch (err) {
        const { message, stack } = err as Error;
        console.error('Error getting blog:', { message, stack });
        
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};

export const createBlog = async (req: IRequestBlog, res: Response) => {
    try {
 const {file} = req
    
        const _id = req?.user?._id as string
        const author = await userModel.findOne({
            _id
        })
       
        const { title, description, isPublished, content } = req.body;
        // const image_url = await uploadFile(file as Express.Multer.File)
        const newBlog =new blogModel({
            title,
            description,
            isPublished,
            content,
            blog_image_url:file?.path
        })
        await newBlog.save()
       
        ResponseService({
            data: newBlog,
            // data:null,
            status: 201,
            success: true,
            message: "Blog created successfully",
            res
        });
    } catch (err) {
        const { message, stack } = err as Error;
        console.error('Error creating blog:', { message, stack });
        
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const updateBlog = await blogModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

        if (!updateBlog) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "Blog not found",
                res
            });
        }

        ResponseService<BlogInterface>({
            data: updateBlog,
            status: 200,
            success: true,
            message: "Blog updated successfully",
            res
        });
    } catch (err) {
        const { message, stack } = err as Error;
        console.error('Error updating blog:', { message, stack });
        
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const blog = await blogModel.findByIdAndDelete({ _id: req.params.id });

        if (!blog) {
            return ResponseService({
                data: null,
                status: 404,
                success: false,
                message: "Blog not found",
                res
            });
        }

        ResponseService<BlogInterface>({
            data: blog,
            status: 200,
            success: true,
            message: "Blog deleted successfully",
            res
        });
    } catch (err) {
        const { message, stack } = err as Error;
        console.error('Error deleting blog:', { message, stack });
        
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
    }
};
