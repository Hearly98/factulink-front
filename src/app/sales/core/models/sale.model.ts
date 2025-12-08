export interface SaleModel {
  venta_id: number;
  serie_id: number;
  numero_completo: string;
  fechaEmision: string;
  doc_id: number;
  suc_id: number;
  vendedor_id: number;
  cli_id: number;
  venta_total: number;
  est: boolean;
  serie?: {
    ser_id: number;
    ser_num: string;
    doc_cod: string;
  };
  documento?: {
    doc_id: number;
    doc_nom: string;
  };
  cliente?: {
    cli_id: number;
    cli_nom: string;
  };
  estado?: {
    estado_cod: string;
    estado_nom: string;
  };
}
