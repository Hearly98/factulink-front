import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  TextColorDirective,
  ModalTitleDirective,
  RowComponent,
  ColComponent,
  ButtonDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    TextColorDirective,
    ModalTitleDirective,
    IconDirective,
    RowComponent,
    ColComponent,
    ButtonDirective,
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  /** Modal title (e.g. “Delete item?”) */
  @Input() title = 'Confirm';
  /** Body message (plain text or short HTML) */
  @Input() message = '';
  /** Which colour theme to use. Default = “warning”. */
  @Input() color: 'info' | 'warning' | 'danger' | 'primary' | 'success' = 'warning';

  /** Show / hide flag – set to true to display the modal */
  @Input() show = signal<boolean>(false);

  /** Optional custom text for the “Cancel” button */
  @Input() cancelText = 'Cancel';
  /** Optional custom text for the “Confirm” button */
  @Input() confirmText = 'Confirm';

  /** Emits when the modal is closed (cancel or escape) */
  @Output() closed = new EventEmitter<void>();
  /** Emits when the user clicks the confirm button */
  @Output() confirmed = new EventEmitter<void>();
  @Output() confirmAction = new EventEmitter<void>();

  iconName = signal('cilWarning');
  constructor(private cdr: ChangeDetectorRef) {}
  private confirmSub?: Subscription;

  /** Close the modal (no action) */
  hide(): void {
    this.show.set(false);
    this.closed.emit();
    this.cdr.markForCheck();
  }

  open(config: {
    title?: string;
    message?: string;
    color?: any;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) {
    this.title = config.title ?? this.title;
    this.message = config.message ?? this.message;
    this.color = config.color ?? this.color;
    this.confirmText = config.confirmText ?? this.confirmText;
    this.cancelText = config.cancelText ?? this.cancelText;

    // limpiar la suscripción previa
    this.confirmSub?.unsubscribe();

    // crear nueva suscripción segura
    this.confirmSub = this.confirmAction.subscribe(() => {
      config.onConfirm?.();
    });

    this.show.set(true);
  }
  /** Confirm action */
  doConfirm(): void {
    this.show.set(false);
    // dispara el evento que el servicio está escuchando
    this.confirmAction.emit();
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']?.currentValue) {
      {
        switch (this.color) {
          case 'warning':
            this.iconName.set('cilWarning');
            break;
          case 'danger':
            this.iconName.set('cilXCircle');
            break;
          case 'success':
            this.iconName.set('cilCheckCircle');
            break;
          default:
            this.iconName.set('cilInfo');
        }
      }
    }
  }
}
