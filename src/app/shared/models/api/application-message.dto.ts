import { ApplicationMessageType } from './application-message-type.dto';

export class ApplicationMessage {
  key!: string;
  message!: string;
  Message?: string;
  messageType!: ApplicationMessageType;
  MessageType?: ApplicationMessageType;
}
