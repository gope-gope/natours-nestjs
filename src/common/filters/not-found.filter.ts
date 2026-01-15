import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const res: ResponseDto<null> = {
      status: 'error',
      statusCode: HttpStatus.NOT_FOUND,
      message: `Cannot find ${request.originalUrl} on this server`,
      data: null,
      dataLength: 0,
    };

    response.status(HttpStatus.NOT_FOUND).json(res);
  }
}
