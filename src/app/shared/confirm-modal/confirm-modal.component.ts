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
} from "@angular/core";
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ButtonCloseDirective, TextColorDirective, ModalTitleDirective } from "@coreui/angular";

@Component({
    selector: "app-confirm-modal",
    standalone: true,
    imports: [ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ButtonCloseDirective, TextColorDirective, ModalTitleDirective],
    templateUrl: "./confirm-modal.component.html",
    styleUrls: ["./confirm-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
    /** Modal title (e.g. “Delete item?”) */
    @Input() title = "Confirm";
    /** Body message (plain text or short HTML) */
    @Input() message = "";
    /** Which colour theme to use. Default = “warning”. */
    @Input() color: "info" | "warning" | "danger" | "primary" | "success" =
        "warning";

    /** Show / hide flag – set to true to display the modal */
    @Input() show = signal<boolean>(false);

    /** Optional custom text for the “Cancel” button */
    @Input() cancelText = "Cancel";
    /** Optional custom text for the “Confirm” button */
    @Input() confirmText = "Confirm";

    /** Emits when the modal is closed (cancel or escape) */
    @Output() closed = new EventEmitter<void>();
    /** Emits when the user clicks the confirm button */
    @Output() confirmed = new EventEmitter<void>();

    iconName = signal('cilWarning');
    constructor(private cdr: ChangeDetectorRef) { }

    /** Close the modal (no action) */
    hide(): void {
        this.show.set(false);
        this.closed.emit();
        this.cdr.markForCheck();
    }

    /** Confirm action */
    doConfirm(): void {
        this.show.set(false);
        this.confirmed.emit();
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