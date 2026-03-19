import { MarcaModel } from './brand.model';

export class GetMarcaModel extends MarcaModel {
  marca_id: number = 0;
  sucursal?: {
    suc_id: number;
    suc_nom: string;
  } | null = null;
}
