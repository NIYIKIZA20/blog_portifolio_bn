import joi from "joi";

export const AddLikeSchema = joi.object({

})

export const LikeParamsSchema = joi.object({
     id: joi.string().min(24)
})