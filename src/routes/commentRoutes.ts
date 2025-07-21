import { Router } from "express";
import { addComment, getAllComments } from "../controllers/commentController";
import { ValidationMiddleware } from "../middleware/validationMiddleware";
import { AddCommentSchema, CommentParamsSchema } from "../schemas/commentSchema";
import { authMiddleware } from "../middleware/authMiddleware";

const commentRouter = Router()

commentRouter.post('/comments/:id/message',
    authMiddleware,
    ValidationMiddleware({ type: 'params', schema: CommentParamsSchema , refType: 'joi' }),
    ValidationMiddleware({ type: 'body', schema: AddCommentSchema, refType: 'joi' }),
    addComment
)

commentRouter.get('/comments', authMiddleware, getAllComments)

export {commentRouter}