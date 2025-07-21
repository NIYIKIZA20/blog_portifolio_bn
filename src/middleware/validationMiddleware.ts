import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from 'joi';
import * as zod from 'zod';
import { ResponseService } from "../utils/response";

interface ValidateOption<T> {
    type: 'body' | 'headers' | 'params';
    schema: ObjectSchema<T> | zod.ZodObject;
    refType: 'joi' | 'zod';
}

export const ValidationMiddleware = <T>({ type, schema, refType}: ValidateOption<T>) => 
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationQueries = req[type];
            if (refType === 'joi') {
                const { error } = (schema as ObjectSchema<T>).validate(validationQueries);
                if (error) {
                    return ResponseService({
                        data: error.details,
                        status: 400,
                        success: false,
                        message: error.message,
                        res
                    });
                }
            } else if (refType === 'zod') {
             
                const result = (schema as zod.ZodTypeAny).safeParse(validationQueries);
                if (!result.success) {
                    return ResponseService({
                        data: result.error,
                        status: 400,
                        success: false,
                        message: result.error.message,
                        res
                    });
                }
            }
            // const { error } = schema.validate(validationQueries);
            
            // if (error) {
            //     return ResponseService({
            //         data: error.details,
            //         status: 400,
            //         success: false,
            //         message: error.message,
            //         res
            //     });
            // }
            
            next();
        } catch (error) {
            console.log('Validation error:', error);
            return ResponseService({
                data: error,
                status: 500,
                success: false,
                message: 'Validation failed',
                res
            });
        }
    };
