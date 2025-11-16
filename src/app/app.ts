import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { iconSubset } from './icons/icon-subset';
import { IconSetService } from '@coreui/icons-angular';
import { ToasterComponent } from '@coreui/angular';
import { GlobalNotification } from './shared/alerts/global-notification/global-notification';
import { AppToastComponent } from './shared/alerts/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild("appToaster")
  toaster!: ToasterComponent;
  protected readonly title = signal('factu-front');
  readonly #iconSetService = inject(IconSetService);
  readonly #globalNotification = inject(GlobalNotification);

  constructor() {
    this.#iconSetService.icons = { ...iconSubset };
  }

  ngAfterViewInit(): void {
    this.#globalNotification.setToaster(this.toaster);
  }
}
