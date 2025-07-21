import joi from "joi";

export const AddUserSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(10).required(),
    gender: joi.string().valid("male", "female", "other").required(),
})

export const LoginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(10).required(),
})

export const UserParamsSchema = joi.object({
    id: joi.string().min(24)
})