export class ResponseDto<T> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: T;
  dataLength?: number;
}
