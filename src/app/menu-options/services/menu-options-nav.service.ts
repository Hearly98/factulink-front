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
      return of(items);
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
   * Mapea las opciones de menú a INavData de forma recursiva
   */
  private mapMenuOptions(options: MenuOptionDto[]): INavData[] {
    return options
      .map((o) => {
        const children = o.children && o.children.length > 0 
          ? this.mapMenuOptions(o.children) 
          : undefined;

        return {
          name: o.name,
          url: o.menuUri,
          iconComponent: o.menuIcon ? { name: o.menuIcon } : undefined,
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
