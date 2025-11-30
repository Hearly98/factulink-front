import { PurchaseDetailCreteDTOForm, PurchaseDetailForm } from 'src/app/purchase-detail/core/types';

export interface PurchaseCreateDto {
  suc_id: number;
  doc_id: number;
  usu_id: number;
  prov_id: number;
  mp_id: number;
  mon_id: number;
  compr_coment: string;
  detalles: PurchaseDetailCreteDTOForm[];
}
