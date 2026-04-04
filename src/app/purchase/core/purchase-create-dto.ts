import { PurchaseDetailCreteDTOForm } from 'src/app/purchase-detail/core/types';

export interface PurchaseCreateDto {
  suc_id: number;
  almacen_id: number;
  doc_id: number;
  prov_id: number;
  mp_cod: number;
  mon_id: number;
  numero: string;
  fechaEmision: Date;
  compr_coment: string;
  afecta_stock: boolean;
  detalles: PurchaseDetailCreteDTOForm[];
}
