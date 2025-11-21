import { Injectable, ApplicationRef, EnvironmentInjector, createComponent } from '@angular/core';
import { ConfirmModalComponent } from '@shared/confirm-modal/confirm-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(options: {
    title?: string;
    message?: string;
    color?: 'info' | 'danger' | 'warning' | 'success' | 'primary';
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {

    return new Promise<boolean>((resolve) => {
      const modalRef = createComponent(ConfirmModalComponent, {
        environmentInjector: this.injector,
      });

      // Insertar dinámicamente en el DOM
      this.appRef.attachView(modalRef.hostView);
      document.body.appendChild(modalRef.location.nativeElement);

      modalRef.instance.open({
        ...options,
        onConfirm: () => {
          resolve(true);
          this.close(modalRef);
        }
      });

      modalRef.instance.closed.subscribe(() => {
        resolve(false);
        this.close(modalRef);
      });
    });
  }

  private close(modalRef: any) {
    this.appRef.detachView(modalRef.hostView);
    modalRef.destroy();
  }
}
