import { Router } from "express";
import { addLike } from "../controllers/likeController";
import { ValidationMiddleware } from "../middleware/validationMiddleware";
import { AddLikeSchema, LikeParamsSchema } from "../schemas/likesSchema";
import { authMiddleware } from "../middleware/authMiddleware";

const likeRouter = Router();

likeRouter.post('/likes/:id/like',
    authMiddleware,
    ValidationMiddleware({ type: 'params', schema: LikeParamsSchema , refType: 'joi' }),
    ValidationMiddleware({ type: 'body', schema: AddLikeSchema, refType: 'joi' }),
    addLike
)

export {likeRouter}