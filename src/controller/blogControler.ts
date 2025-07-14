import { Request, Response } from 'express';
import { blogSchema } from '../schema/blogsSchema';
import { readBlogs, writeBlogs, generateId } from '../utils/helper';
import { sendSuccessResponse, sendErrorResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/response';
import { upload } from '../middleware/upload';
import { Blog } from '../types/types';

export class BlogController {
  // Create a new blog
  static createBlog = [
    upload.single('profilePhoto'),
    (req: Request, res: Response) => {
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
        return sendErrorResponse(res, error.details.map(d => d.message).join(', '));
      }

      const blogs = readBlogs();
      const newBlog: Blog = {
        id: generateId(),
        ...value,
      };
      
      blogs.push(newBlog);
      writeBlogs(blogs);
      return sendCreatedResponse(res, newBlog);
    }
  ];

  // Get all blogs
  static getAllBlogs = (req: Request, res: Response) => {
    const blogs = readBlogs();
    return sendSuccessResponse(res, blogs);
  };

  // Get blog by ID
  static getBlogById = (req: Request, res: Response) => {
    const blogs = readBlogs();
    const blog = blogs.find(b => b.id === req.params.id);
    
    if (!blog) {
      return sendNotFoundResponse(res, 'Blog not found');
    }
    
    return sendSuccessResponse(res, blog);
  };

  // Update blog
  static updateBlog = [
    upload.single('profilePhoto'),
    (req: Request, res: Response) => {
      const blogs = readBlogs();
      const idx = blogs.findIndex(b => b.id === req.params.id);
      
      if (idx === -1) {
        return sendNotFoundResponse(res, 'Blog not found');
      }

      const { title, name, description } = req.body;
      const file = req.file;
      const now = new Date().toISOString();

      const { error, value } = blogSchema.validate({
        title: title ?? blogs[idx].title,
        name: name ?? blogs[idx].name,
        description: description ?? blogs[idx].description,
        profilePhoto: file ? `/uploads/${file.filename}` : blogs[idx].profilePhoto,
        created: blogs[idx].created,
        updated: now,
      });

      if (error) {
        return sendErrorResponse(res, error.details.map(d => d.message).join(', '));
      }

      blogs[idx] = { ...blogs[idx], ...value };
      writeBlogs(blogs);
      return sendSuccessResponse(res, blogs[idx]);
    }
  ];

  // Delete blog
  static deleteBlog = (req: Request, res: Response) => {
    const blogs = readBlogs();
    const idx = blogs.findIndex(b => b.id === req.params.id);
    
    if (idx === -1) {
      return sendNotFoundResponse(res, 'Blog not found');
    }
    
    const [deleted] = blogs.splice(idx, 1);
    writeBlogs(blogs);
    return sendSuccessResponse(res, { message: 'Blog deleted', blog: deleted });
  };
}
