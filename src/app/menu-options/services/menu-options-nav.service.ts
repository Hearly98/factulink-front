import { inject, Injectable } from '@angular/core';
import { MenuOptionsService } from './menu-options.service';
import { INavData } from '@coreui/angular';
import { Observable, map, of, forkJoin } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { MenuOptionDto } from '../models/menu-option.dto';

@Injectable({
  providedIn: 'root',
})
export class MenuOptionsNavService {
  private readonly enableTitle = false;
  readonly #menuOption = inject(MenuOptionsService);
  readonly #ngxPermissions = inject(NgxPermissionsService);

  /**
   * Cargar permisos del usuario en ngx-permissions
   */
  loadUserPermissions(): Observable<void> {
    return this.#menuOption.getUserPermissions().pipe(
      map((response) => {
        if (response.isValid && response.data) {
          // Cargar permisos en ngx-permissions
          const permissions = response.data.reduce(
            (acc: Record<string, any>, code: string) => {
              acc[code] = {};
              return acc;
            },
            {} as Record<string, any>,
          );

          this.#ngxPermissions.loadPermissions(Object.keys(permissions));
        }
      }),
    );
  }

  /**
   * Obtener menú del usuario
   */
  listMenu(): Observable<INavData[]> {
    const menuItemsJson = sessionStorage.getItem('menuConfig');
    const updateMenuConfig = sessionStorage.getItem('updateMenuConfig') === 'true';

    if (menuItemsJson && !updateMenuConfig) {
      const items: INavData[] = JSON.parse(menuItemsJson);
      return of(items);
    }

    sessionStorage.setItem('updateMenuConfig', 'false');

    // Cargar permisos y menú en paralelo
    return forkJoin({
      permissions: this.#menuOption.getUserPermissions(),
      menu: this.#menuOption.listTree(),
    }).pipe(
      map(({ permissions, menu }) => {
        const items: INavData[] = [];

        // Home siempre presente
        items.push({
          name: 'Inicio',
          url: '/home',
          iconComponent: { name: 'cil-home' },
        });

        if (this.enableTitle) {
          items.push({
            title: true,
            name: 'Opciones',
          });
        }

        // Cargar permisos en ngx-permissions
        if (permissions.isValid && permissions.data) {
          const permissionsCodes = permissions.data;
          const permissionsObj = permissionsCodes.reduce(
            (acc: Record<string, any>, code: string) => {
              acc[code] = {};
              return acc;
            },
            {} as Record<string, any>,
          );

          this.#ngxPermissions.loadPermissions(Object.keys(permissionsObj));
        }

        // Construir menú desde el backend
        if (menu.isValid && menu.data) {
          const tree = this.mapMenuOptions(menu.data);
          items.push(...tree);
          sessionStorage.setItem('menuConfig', JSON.stringify(items));
        }

        return items;
      }),
    );
  }

  /**
   * Mapea las opciones de menú a INavData de forma recursiva
   * @param isChild - indica si estos elementos son children (usan 'icon' en lugar de 'iconComponent')
   */
  private mapMenuOptions(options: MenuOptionDto[], isChild: boolean = false): INavData[] {
    return options
      .map((o) => {
        const hasChildren = o.children && o.children.length > 0;
        const children = hasChildren ? this.mapMenuOptions(o.children, true) : undefined;

        const menuIcon = o.menuIcon?.trim() || '';

        // Padres: usan iconComponent si tienen icono válido
        // Hijos: usan icon (COREUI usa 'nav-icon-bullet' para bullets)
        let iconData: { iconComponent?: { name: string } } | { icon?: string } = {};

        if (!isChild) {
          // Es padre - usar iconComponent si tiene icono válido
          const hasValidIcon = menuIcon.length > 0 && menuIcon !== 'nav-icon-bullet';
          if (hasValidIcon) {
            iconData = { iconComponent: { name: menuIcon } };
          }
        } else {
          // Es hijo - siempre usar 'icon' con 'nav-icon-bullet'
          // (así funciona COREUI para los bullets de los submenús)
          iconData = { icon: menuIcon || 'nav-icon-bullet' };
        }

        return {
          name: o.name,
          url: o.menuUri,
          ...iconData,
          children: children,
        } as INavData;
      })
      .sort((a, b) => {
        const sortA = options.find((opt) => opt.name === a.name)?.sortOrder ?? 0;
        const sortB = options.find((opt) => opt.name === b.name)?.sortOrder ?? 0;
        return sortA - sortB;
      });
  }
}
