import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(error: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Validation error
    if (error instanceof MongooseError.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: messages,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // CastError (invalid ObjectId)
    if (error instanceof MongooseError.CastError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }

    // Duplicate key error
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue)[0];
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          field === 'email'
            ? 'This email is already registered'
            : `Duplicate field value: ${field}`,
      });
    }

    console.log(error);

    // Fallback
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error',
    });
  }
}
