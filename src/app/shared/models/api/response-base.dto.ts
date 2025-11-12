import { ApplicationMessage } from './application-message.dto';

export class ResponseBaseDto {
  isValid!: boolean;
  messages: ApplicationMessage[] = [];

  static getMessages(response: ResponseBaseDto): string {
    var messages = '';

    if (response.messages) {
      response.messages.forEach((item) => messages = messages + item.message + '\n')
    }

    return messages;
  };
}
