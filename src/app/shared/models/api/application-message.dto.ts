import { ApplicationMessageType } from './application-message-type.dto';

export class ApplicationMessage {
  key!: string;
  message!: string;
  messageType!: ApplicationMessageType;
}
