import { Request, Response } from 'express';
import { blogSchema } from '../schema/blogsSchema';
import { sendSuccessResponse, sendErrorResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/response';
import { upload } from '../middleware/upload';
import { BlogModel } from '../types/types';
import mongoose from 'mongoose';

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

function mapBlog(blog: any) {
  if (!blog) return blog;
  const obj = blog.toObject ? blog.toObject() : blog;
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
}

export class BlogController {
  // Create a new blog
  static createBlog = [
    upload.single('profilePhoto'),
    async (req: Request, res: Response) => {
      try {
        const { title, name, description } = req.body;
        const file = req.file;
        const now = new Date().toISOString();

        const { error, value } = blogSchema.validate({
          title,
          name,
          description,
          profilePhoto: file ? `/uploads/${file.filename}` : undefined,
          created: now,
          updated: now,
        });

        if (error) {
          return sendErrorResponse(res, error.details.map(d => d.message).join(', '), 400, 'VALIDATION_ERROR');
        }

        const newBlog = await BlogModel.create(value);
        return sendCreatedResponse(res, {
          message: 'Blog created successfully',
          blog: mapBlog(newBlog),
        });
      } catch (err: any) {
        return sendErrorResponse(res, err.message || 'Failed to create blog', 500, 'DB_ERROR');
      }
    }
  ];

  // Get all blogs
  static getAllBlogs = async (req: Request, res: Response) => {
    try {
      const blogs = await BlogModel.find();
      return sendSuccessResponse(res, {
        message: 'Blogs fetched successfully',
        blogs: blogs.map(mapBlog),
      });
    } catch (err: any) {
      return sendErrorResponse(res, err.message || 'Failed to fetch blogs', 500, 'DB_ERROR');
    }
  };

  // Get blog by ID
  static getBlogById = async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id)) {
      return sendErrorResponse(res, 'Invalid blog ID', 400, 'INVALID_ID');
    }
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) {
        return sendNotFoundResponse(res, 'Blog not found');
      }
      return sendSuccessResponse(res, {
        message: 'Blog fetched successfully',
        blog: mapBlog(blog),
      });
    } catch (err: any) {
      return sendErrorResponse(res, err.message || 'Failed to fetch blog', 500, 'DB_ERROR');
    }
  };

  // Update blog
  static updateBlog = [
    upload.single('profilePhoto'),
    async (req: Request, res: Response) => {
      if (!isValidObjectId(req.params.id)) {
        return sendErrorResponse(res, 'Invalid blog ID', 400, 'INVALID_ID');
      }
      try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
          return sendNotFoundResponse(res, 'Blog not found');
        }

        const { title, name, description } = req.body;
        const file = req.file;
        const now = new Date().toISOString();

        const { error, value } = blogSchema.validate({
          title: title ?? blog.title,
          name: name ?? blog.name,
          description: description ?? blog.description,
          profilePhoto: file ? `/uploads/${file.filename}` : blog.profilePhoto,
          created: blog.created,
          updated: now,
        });

        if (error) {
          return sendErrorResponse(res, error.details.map(d => d.message).join(', '), 400, 'VALIDATION_ERROR');
        }

        blog.set(value);
        await blog.save();
        return sendSuccessResponse(res, {
          message: 'Blog updated successfully',
          blog: mapBlog(blog),
        });
      } catch (err: any) {
        return sendErrorResponse(res, err.message || 'Failed to update blog', 500, 'DB_ERROR');
      }
    }
  ];

  // Delete blog
  static deleteBlog = async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id)) {
      return sendErrorResponse(res, 'Invalid blog ID', 400, 'INVALID_ID');
    }
    try {
      const blog = await BlogModel.findByIdAndDelete(req.params.id);
      if (!blog) {
        return sendNotFoundResponse(res, 'Blog not found');
      }
      return sendSuccessResponse(res, {
        message: 'Blog deleted successfully',
        blog: mapBlog(blog),
      });
    } catch (err: any) {
      return sendErrorResponse(res, err.message || 'Failed to delete blog', 500, 'DB_ERROR');
    }
  };
}
