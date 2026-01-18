export interface QuotationModel {
  cot_id: number;
  serie_id: number;
  numero_completo: string;
  fecha_emision: string;
  fecha_valido_hasta: string;
  cli_id: number;
  cot_total: number;
  est: boolean;
  serie?: {
    ser_id: number;
    ser_num: string;
    doc_cod: string;
  };
  cliente?: {
    cli_id: number;
    cli_nom: string;
  };
}
