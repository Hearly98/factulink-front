import { ResponseBaseDto } from './response-base.dto';

export class ResponseDto<T> extends ResponseBaseDto {
  data!: T;
}
