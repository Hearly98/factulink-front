import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  INavData
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { MenuOptionsNavService } from '../../menu-options/services/menu-options-nav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    CommonModule,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = signal<INavData[]>([]);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  ngOnInit() {
    this.loadMenu();
  }

  private loadMenu() {
    this.menuOptionsNavService.listMenu().subscribe({
      next: (items: INavData[]) => {
        this.navItems.set(items);
      },
      error: (err: Error) => {
        console.error('Error loading menu:', err);
        // Fallback a menú vacío o por defecto
        this.navItems.set([]);
      }
    });
  }
}
