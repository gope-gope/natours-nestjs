import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(error: unknown | MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('error;:', error);

    // Validation error
    if (error instanceof MongooseError.ValidationError) {
      console.log('IF 1');
      const messages = Object.values(error.errors).map((err) => err.message);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: messages,
        path: request.url,
      });
    }

    // CastError (invalid ObjectId)
    if (error instanceof MongooseError.CastError) {
      console.log('IF 2');

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }

    // Duplicate key error
    if ((error as any).code === 11000) {
      console.log('IF 3');

      const field = Object.keys((error as any).keyValue)[0];
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Duplicate field value: ${field}`,
      });
    }

    const errorAny = error as any;
    const errorAnyMessage = errorAny.response.message.map(
      (msg: string) => `${msg.slice(0, 1).toLocaleUpperCase() + msg.slice(1)}.`,
    );

    return response.status(HttpStatus.BAD_REQUEST).json({
      status: errorAny.error,
      statusCode: errorAny.statusCode,
      message: errorAnyMessage,
      data: null,
      dataLength: 0,
    });
  }
}
