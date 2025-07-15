import { Response } from 'express';

export function sendSuccessResponse(res: Response, data: any, statusCode: number = 200) {
  return res.status(statusCode).json(data);
}

export function sendErrorResponse(res: Response, message: string, statusCode: number = 400, code?: string) {
  const errorResponse: any = {
    status: 'error',
    message,
  };
  if (code) errorResponse.code = code;
  return res.status(statusCode).json(errorResponse);
}

export function sendNotFoundResponse(res: Response, message: string = 'Resource not found') {
  return res.status(404).json({ error: message });
}

export function sendCreatedResponse(res: Response, data: any) {
  return res.status(201).json(data);
}
