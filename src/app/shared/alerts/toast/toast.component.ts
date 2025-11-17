import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconDirective],
  template: `
    <div class="toast-content" *ngIf="!isHiding">
      <div class="toast-icon">
        <svg cIcon [name]="getIcon()" [ngClass]="'icon-' + color"></svg>
      </div>

      <div class="toast-body-content">
        <h4 class="toast-title">{{ title }}</h4>
        <p class="toast-message">{{ message }}</p>
      </div>

      <button
        *ngIf="closeButton"
        type="button"
        class="toast-close-btn"
        (click)="handleClose($event)"
        aria-label="Cerrar"
      >
        <svg cIcon name="cilX"></svg>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block !important;
        background: white !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid #e5e7eb !important;
        border-left: 4px solid !important;
        padding: 16px !important;
        min-width: 320px !important;
        max-width: 420px !important;
        margin-bottom: 12px !important;
        transition: opacity 0.3s ease-out, transform 0.3s ease-out !important;
      }

      :host.success {
        border-left-color: #00a24f !important;
      }

      :host.warning {
        border-left-color: #ffc900 !important;
      }

      :host.danger {
        border-left-color: #ef4444 !important;
      }

      :host.info {
        border-left-color: #00319b !important;
      }

      :host.hiding {
        opacity: 0 !important;
        transform: translateX(100%) !important;
      }

      .toast-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .toast-icon {
        flex-shrink: 0;
        margin-top: 2px;
      }

      .icon-success {
        color: #00a24f;
      }

      .icon-warning {
        color: #ffc900;
      }

      .icon-danger {
        color: #ef4444;
      }

      .icon-info {
        color: #00319b;
      }

      .toast-body-content {
        flex: 1;
        min-width: 0;
      }

      .toast-title {
        font-size: 15px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px 0;
        line-height: 1.4;
      }

      .toast-message {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .toast-close-btn {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        padding: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        color: #9ca3af;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
        margin-top: 2px;
        position: relative;
        z-index: 10;
      }

      .toast-close-btn:hover {
        color: #4b5563;
      }

      .toast-close-btn:focus {
        outline: none;
      }

      .toast-close-btn:active {
        transform: scale(0.95);
      }
    `,
  ],
  providers: [
    {
      provide: ToastComponent,
      useExisting: forwardRef(() => AppToastComponent),
    },
  ],
})
export class AppToastComponent extends ToastComponent implements OnDestroy {
  @Input() closeButton = true;
  @Input() title = '';
  @Input() message = '';
  @Input() selectColor: 'success' | 'info' | 'warning' | 'danger' = 'info';

  isHiding = false;
  private cleanupTimeout: any;

  override ngOnInit(): void {
    super.ngOnInit();
    this.renderer.addClass(this.hostElement.nativeElement, this.selectColor);

    this.renderer.setStyle(
      this.hostElement.nativeElement,
      'border-left',
      `4px solid ${this.getBorderColor()}`
    );

    // Monitorear cambios en la propiedad visible
    this.watchVisibleChanges();
  }

  private watchVisibleChanges(): void {
    // Usar un intervalo corto para detectar cuando visible cambia a false
    const interval = setInterval(() => {
      if (!this.visible && !this.isHiding) {
        this.performCleanup();
        clearInterval(interval);
      }
    }, 100);

    // Limpiar el intervalo después de 30 segundos por seguridad
    setTimeout(() => clearInterval(interval), 30000);
  }

  override ngOnDestroy(): void {
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
    }
    super.ngOnDestroy();
  }

  getBorderColor(): string {
    switch (this.selectColor) {
      case 'success':
        return '#00a24f';
      case 'warning':
        return '#ffc900';
      case 'danger':
        return '#ef4444';
      case 'info':
      default:
        return '#00319b';
    }
  }

  getIcon() {
    switch (this.selectColor) {
      case 'success':
        return 'cilCheckCircle';
      case 'warning':
        return 'cilWarning';
      case 'danger':
        return 'cilX';
      case 'info':
      default:
        return 'cilInfo';
    }
  }

  handleClose(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.isHiding) {
      return;
    }

    this.visible = false;
    this.performCleanup();
  }

  private performCleanup(): void {
    if (this.isHiding) {
      return;
    }

    this.isHiding = true;
    this.renderer.addClass(this.hostElement.nativeElement, 'hiding');
    this.changeDetectorRef.detectChanges();

    this.cleanupTimeout = setTimeout(() => {
      const element = this.hostElement.nativeElement;
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  }
}
