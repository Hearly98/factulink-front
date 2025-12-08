export interface QuotationCreateDto {
  serie_id: number;
  suc_id: number;
  usu_id: number;
  cli_id: number;
  mon_id: number;
  fechaEmision: Date;
  cot_coment: string;
  detalles: QuotationDetailCreateDto[];
}

export interface QuotationDetailCreateDto {
  prod_id: number;
  detc_cant: number;
  prod_pventa: number;
}
