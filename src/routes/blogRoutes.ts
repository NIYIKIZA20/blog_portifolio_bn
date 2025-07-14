import { Router } from 'express';
import { BlogController } from '../controller/blogControler';

const blogRouter = Router();

// Blog routes
blogRouter.post('/blogs', BlogController.createBlog);
blogRouter.get('/blogs', BlogController.getAllBlogs);
blogRouter.get('/blogs/:id', BlogController.getBlogById);
blogRouter.put('/blogs/:id', BlogController.updateBlog);
blogRouter.delete('/blogs/:id', BlogController.deleteBlog);

export { blogRouter }; 