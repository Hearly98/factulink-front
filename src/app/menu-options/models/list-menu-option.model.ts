import { GetMenuOptionModel } from "./get-menu-option.model";

/**
 * @deprecated Este modelo ya no se usa. Usar MenuOptionDto directamente.
 * Se mantiene por compatibilidad con código legacy.
 */
export interface ListMenuOptionModel extends GetMenuOptionModel {
    actions: any[];
}
