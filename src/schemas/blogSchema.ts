import joi from 'joi';

export const AddBlogSchema = joi.object({
    title: joi.string().required(),
    isPublished: joi.boolean().required(),
    description: joi.string().min(20).required(),
    content: joi.string().required()
});

export const UpdateBlogSchema = joi.object({
    title: joi.string(),
    isPublished: joi.boolean(),
    description: joi.string().min(20),
    content: joi.string()
});

export const BlogParamsSchema = joi.object({
    id: joi.string().min(24)
})