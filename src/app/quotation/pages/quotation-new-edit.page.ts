import { Component, inject, Inject, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { QuotationService } from '../core/services/quotation.service';
import { BaseComponent } from '@shared/base/base.component';

@Component({
    selector: 'app-quotation-new-edit',
    standalone: true,
    imports: [
        CommonModule,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        IconDirective,
        ButtonDirective,
        TableDirective,
        ReactiveFormsModule,
        PaginatorComponent,
        DatePipe,
        CurrencyPipe,
    ],
    template: `

  `,
})
export class QuotationNewEditPage extends BaseComponent {
    title = 'Nueva Cotización';

    #quotationService = inject(QuotationService);
    #confirmService = inject(ConfirmService);
    #globalNotification = inject(GlobalNotification);

    constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(MODULES.SALES, viewContainerRef);
    }

    ngOnInit(): void {
    }


}
