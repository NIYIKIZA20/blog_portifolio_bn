import { Router } from "express";
import { 
    getAllBlogs, 
    getBlog, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} from '../controllers/blogController';
import { ValidationMiddleware } from "../middleware/validationMiddleware";
import { AddBlogSchema, UpdateBlogSchema, BlogParamsSchema } from '../schemas/blogSchema';
import { authMiddleware, checkRole } from "../middleware/authMiddleware";
import { storage } from "../utils/upload";
import multer from "multer";
const uploadMiddleware = multer({storage})
const blogRouter = Router();

blogRouter.get('/blogs', getAllBlogs);

blogRouter.get('/blogs/:id',
    ValidationMiddleware({ type: 'params', schema: BlogParamsSchema, refType: 'joi' }),
    getBlog
);

blogRouter.post('/blogs',
    authMiddleware,
    checkRole(['admin']),
    uploadMiddleware.single('image'),
    ValidationMiddleware({ type: 'body', schema: AddBlogSchema, refType: 'joi' }),
    createBlog
);

blogRouter.put('/blogs/:id',
    authMiddleware,
    checkRole(['admin']),
    ValidationMiddleware({ type: 'params', schema: BlogParamsSchema, refType: 'joi' }),
    ValidationMiddleware({ type: 'body', schema: UpdateBlogSchema, refType: 'joi' }),
    updateBlog
);

blogRouter.delete('/blogs/:id',
    authMiddleware,
    checkRole(['admin']),
    ValidationMiddleware({ type: 'params', schema: BlogParamsSchema, refType: 'joi' }),
    deleteBlog
);

export { blogRouter };
