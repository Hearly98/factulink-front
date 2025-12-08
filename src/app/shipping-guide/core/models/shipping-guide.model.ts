export interface ShippingGuideModel {
  guia_id: number;
  serie_id: number;
  numero_completo: string;
  fecha_emision: string;
  tipo_traslado: string;
  destinatario_nombre: string;
  est: boolean;
  serie?: {
    ser_id: number;
    ser_num: string;
    doc_cod: string;
  };
}
