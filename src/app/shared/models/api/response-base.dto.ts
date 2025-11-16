import { ApplicationMessage } from './application-message.dto';

export class ResponseBaseDto {
  isValid: boolean = false;
  messages: ApplicationMessage[] = [];
  Messages?: ApplicationMessage[];

  static getMessages(response: ResponseBaseDto): string {
    let messages = '';

    if (response.messages) {
      response.messages.forEach((item) => messages = messages + item.message + '\n')
    }

    return messages;
  };
}
