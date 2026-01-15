import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(error: unknown | MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const res: ResponseDto<null> = {
      status: 'error',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'An error occurred',
      data: null,
      dataLength: 0,
    };

    // Validation error
    if (error instanceof MongooseError.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.message = 'Validation failed: ' + messages.join(', ');
      return response.status(HttpStatus.BAD_REQUEST).json(res);
    }

    // CastError (invalid ObjectId)
    if (error instanceof MongooseError.CastError) {
      res.message = `Invalid ${error.path}: ${error.value}`;
      return response.status(HttpStatus.BAD_REQUEST).json(res);
    }

    // Duplicate key error
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue)[0];
      res.message = `Duplicate field value: ${field}`;
      return response.status(HttpStatus.BAD_REQUEST).json(res);
    }

    // Other errors (e.g., thrown manually with HttpException)
    const errorAny = error as any;
    if (errorAny?.response?.message) {
      const errorAnyMessage = Array.isArray(errorAny.response.message)
        ? errorAny.response.message
            .map(
              (msg: string) =>
                `${msg.slice(0, 1).toUpperCase() + msg.slice(1)}.`,
            )
            .join(' ')
        : errorAny.response.message;

      res.statusCode = errorAny.statusCode ?? HttpStatus.BAD_REQUEST;
      res.message = errorAnyMessage;
    }

    return response.status(res.statusCode).json(res);
  }
}
