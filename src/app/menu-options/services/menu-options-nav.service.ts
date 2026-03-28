import { Injectable } from "@angular/core";
import { MenuOptionsService } from "./menu-options.service";
import { INavData } from "@coreui/angular";
import { Observable, map, of, forkJoin } from "rxjs";
import { NgxPermissionsService } from "ngx-permissions";
import { MenuOptionDto } from "../models/menu-option.dto";

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsNavService {
  private enableTitle = false;

  constructor(
    private menuOptionsService: MenuOptionsService,
    private ngxPermissionsService: NgxPermissionsService
  ) {}

  /**
   * Cargar permisos del usuario en ngx-permissions
   */
  loadUserPermissions(): Observable<void> {
    return this.menuOptionsService.getUserPermissions().pipe(
      map((response) => {
        if (response.isValid && response.data) {
          // Cargar permisos en ngx-permissions
          const permissions = response.data.reduce((acc: Record<string, any>, code: string) => {
            acc[code] = {};
            return acc;
          }, {} as Record<string, any>);
          
          this.ngxPermissionsService.loadPermissions(Object.keys(permissions));
        }
      })
    );
  }

  /**
   * Obtener menú del usuario
   */
  listMenu(): Observable<INavData[]> {
    const menuItemsJson = sessionStorage.getItem("menuConfig");
    const updateMenuConfig = sessionStorage.getItem("updateMenuConfig") === "true";

    if (menuItemsJson && !updateMenuConfig) {
      const items: INavData[] = JSON.parse(menuItemsJson);
      // Limpiar iconos también para el menú cacheado
      const cleanedItems = this.cleanMenuIcons(items);
      return of(cleanedItems);
    }

    sessionStorage.setItem("updateMenuConfig", "false");

    // Cargar permisos y menú en paralelo
    return forkJoin({
      permissions: this.menuOptionsService.getUserPermissions(),
      menu: this.menuOptionsService.listTree()
    }).pipe(
      map(({ permissions, menu }) => {
        const items: INavData[] = [];

        // Home siempre presente
        items.push({
          name: "Inicio",
          url: "/home",
          iconComponent: { name: "cil-home" },
        });

        if (this.enableTitle) {
          items.push({
            title: true,
            name: "Opciones",
          });
        }

        // Cargar permisos en ngx-permissions
        if (permissions.isValid && permissions.data) {
          const permissionsCodes = permissions.data;
          const permissionsObj = permissionsCodes.reduce((acc: Record<string, any>, code: string) => {
            acc[code] = {};
            return acc;
          }, {} as Record<string, any>);
          
          this.ngxPermissionsService.loadPermissions(Object.keys(permissionsObj));
        }

        // Construir menú desde el backend
        if (menu.isValid && menu.data) {
          const tree = this.mapMenuOptions(menu.data);
          items.push(...tree);
          sessionStorage.setItem("menuConfig", JSON.stringify(items));
        }

        return items;
      })
    );
  }

  /**
   * Limpia los iconos del menú para evitar warnings de CoreUI
   * Elimina iconos inválidos o 'nav-icon-bullet' de menús cacheados
   */
  private cleanMenuIcons(items: INavData[]): INavData[] {
    return items.map((item) => {
      // Limpiar icono del item actual
      const iconValue = (item as any).icon;
      const iconComponentName = item.iconComponent?.name;
      
      // Eliminar propiedad 'icon' si existe (causa el warning)
      delete (item as any).icon;
      
      // Verificar si el iconComponent es válido
      const isValidIcon = iconComponentName && 
        iconComponentName !== 'nav-icon-bullet' && 
        iconComponentName.trim().length > 0;
      
      if (!isValidIcon) {
        item.iconComponent = undefined;
      }

      // Procesar hijos recursivamente
      if (item.children && item.children.length > 0) {
        item.children = this.cleanMenuIcons(item.children);
      }

      return item;
    });
  }

  /**
   * Mapea las opciones de menú a INavData de forma recursiva
   */
  private mapMenuOptions(options: MenuOptionDto[]): INavData[] {
    return options
      .map((o) => {
        const children = o.children && o.children.length > 0 
          ? this.mapMenuOptions(o.children) 
          : undefined;

        // Limpiar el icono - si no hay icono válido, no enviar nada
        // Los submódulos sin icono no deben tener propiedad icon ni iconComponent
        const menuIcon = o.menuIcon?.trim() || '';
        const hasValidIcon = menuIcon.length > 0 && menuIcon !== 'nav-icon-bullet';

        return {
          name: o.name,
          url: o.menuUri,
          ...(hasValidIcon ? { iconComponent: { name: menuIcon } } : {}),
          children: children,
        } as INavData;
      })
      .sort((a, b) => {
        const sortA = options.find(opt => opt.name === a.name)?.sortOrder ?? 0;
        const sortB = options.find(opt => opt.name === b.name)?.sortOrder ?? 0;
        return sortA - sortB;
      });
  }
}
