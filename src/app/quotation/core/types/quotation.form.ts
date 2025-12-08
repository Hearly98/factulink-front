export interface QuotationForm {
  serie_id: number | null;
  suc_id: number | null;
  usu_id: number | null;
  cli_id: number | null;
  fechaEmision: Date | null;
  mon_id: number | null;
  cli_documento: string | null;
  cli_direcc: string | null;
  cli_correo: string | null;
  cli_telf: string | null;
  tip_id: number | null;
  cot_coment: string | null;
  prod_id: number | null;
  detalles: QuotationDetailForm[] | null;
}

export interface QuotationDetailForm {
  prod_id: number;
  cantidad: number;
  prod_nom: string;
  prod_cod: string;
  unidad: string;
  precio_unitario: number;
  dscto: number | null;
  precio_total: number | null;
}
