import { PurchaseDetailForm } from 'src/app/purchase-detail/core/types';

export interface PurchaseForm {
  suc_id: number | null;
  alm_id: number | null;
  doc_id: number | null;
  usu_id: number | null;
  prov_id: number | null;
  numero: string | null;
  fechaEmision: Date | null;
  mp_id: number | null;
  mon_id: number | null;
  prov_documento: string | null;
  afecta_stock: boolean | null;
  prov_direcc: string | null;
  prov_correo: string | null;
  prov_telf: string | null;
  tip_id: number | null;
  compr_coment: string | null;
  prod_id: number | null;
  detalles: PurchaseDetailForm[] | null;
}
