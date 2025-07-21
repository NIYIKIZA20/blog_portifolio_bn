import joi from "joi"

export const AddCommentSchema = joi.object({
    message: joi.string().min(20).required()
})

export const CommentParamsSchema = joi.object({
    id: joi.string().min(24)
})