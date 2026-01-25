import { Injectable } from "@angular/core";
import { ToasterComponent } from "@coreui/angular";
import { ResponseBaseDto } from "../../models/api/response-base.dto";
import { AppToastComponent } from "../toast/toast.component";
import { ApplicationMessage } from "../../models/api/application-message.dto";

const DEFAULT_DELAY = 5000;

@Injectable({
  providedIn: "root",
})
export class GlobalNotification {
  private toaster: ToasterComponent | null = null;
  private pendingToasts: Array<{
    title: string;
    message: string;
    color: "success" | "info" | "warning" | "danger";
  }> = [];

  setToaster(toaster: ToasterComponent) {
    this.toaster = toaster;
    
    if (this.pendingToasts.length > 0) {
      this.pendingToasts.forEach(toast => {
        this.showToast(toast.title, toast.message, toast.color);
      });
      this.pendingToasts = [];
    }
  }

  openToastAlert(
    title: string,
    message: string,
    color: "success" | "info" | "warning" | "danger" = "info",
  ) {
    if (!this.toaster) {
      console.warn("⚠️ Toaster no inicializado aún. Toast guardado para mostrar después.");
      this.pendingToasts.push({ title, message, color });
      return;
    }

    this.showToast(title, message, color);
  }

  private showToast(
    title: string,
    message: string,
    color: "success" | "info" | "warning" | "danger"
  ) {
    const props = {
      title,
      message,
      selectColor: color,
      autohide: true,
      delay: DEFAULT_DELAY,
    };

    this.toaster!.addToast(AppToastComponent, props);
  }

  openAlert(response: ResponseBaseDto, timeOut = 500): void {
    if (response == null) return;
    if (response.Messages == null && response.messages == null) return;
    const messages = response.Messages ?? response.messages;

    messages.forEach((message: ApplicationMessage, index: number) => {
      let title = "Información";
      let color: "success" | "info" | "warning" | "danger" = "info";

      const MessageType = message.MessageType ?? message.messageType;
      switch (MessageType) {
        case 0:
          title = "¡Éxito!";
          color = "success";
          break;
        case 1:
          title = "Información";
          color = "info";
          break;
        case 2:
          title = "Advertencia";
          color = "warning";
          break;
        case 3:
          title = "Error";
          color = "danger";
          break;
      }
      
      const Message = message.Message ?? message.message;
      if (Message) {
        setTimeout(() => {
          this.openToastAlert(title, Message as string, color);
        }, index * (timeOut + 500));
      }
    });
  }
}