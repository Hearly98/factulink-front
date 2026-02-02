import { MenuOptionDto } from "./menu-option.dto";

/**
 * @deprecated Este modelo ya no se usa. Usar MenuOptionDto directamente.
 * Se mantiene por compatibilidad con código legacy.
 */
export interface UpdateMenuOptionModel extends MenuOptionDto {
  id: number;
  isActive: boolean;
}
