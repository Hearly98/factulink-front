import { MenuOptionDto } from "./menu-option.dto";

/**
 * @deprecated Este modelo ya no se usa. Usar MenuOptionDto directamente.
 * Se mantiene por compatibilidad con código legacy.
 */
export interface GetMenuOptionModel extends Omit<MenuOptionDto, 'id'> {
    id: string;
    applicationCode: string;
    applicationName: string;
    moduleId: string;
    moduleCode: string;
    moduleName: string;
    actionName: string;
    parentCode: string;
    parentName: string;
    isActive: boolean;
}
