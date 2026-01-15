import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.NOT_FOUND).json({
      status: 'fail',
      statusCode: 404,
      message: `Cannot find ${request.originalUrl} on this server`,
    });
  }
}
