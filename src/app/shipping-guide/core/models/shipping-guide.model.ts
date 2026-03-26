export interface ShippingGuideModel {
  guia_id: number;
  serie_id: number;
  numero_completo: string;
  fecha_emision: string;
  fecha_inicio_traslado?: string;
  tipo_traslado: string;
  destinatario_nombre: string;
  partida_ubigeo?: string;
  partida_direccion?: string;
  destino_ubigeo?: string;
  destino_direccion?: string;
  motivo_traslado?: string;
  transportista_tipo_doc?: string;
  transportista_nro_doc?: string;
  transportista_licencia?: string;
  transportista_placa?: string;
  empresa_transporte_tipo_doc?: string;
  empresa_transporte_nro_doc?: string;
  empresa_transporte_razon_social?: string;
  nro_cotizacion?: string;
  nro_oc?: string;
  nro_factura?: string;
  observaciones?: string;
  est: boolean;
  detalles?: ShippingGuideDetailModel[];
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

export interface ShippingGuideDetailModel {
  guia_det_id: number;
  guia_id: number;
  prod_id: number;
  cantidad: number;
  peso_unitario: number;
  peso_total: number;
  descripcion?: string;
  producto?: {
    prod_id: number;
    prod_nom: string;
    prod_cod_interno: string;
  };
}
