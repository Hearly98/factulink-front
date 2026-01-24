import { SaleDetailForm } from "src/app/sale-detail/core/types/sale-detail.form";

export interface SaleForm {
    venta_id: number | null;
    serie_id: number | null;
    fecha_emision: number | null,
    fecha_vencimiento: number | null,
    emp_id: number | null,
    suc_id: number | null,
    cli_id: number | null,
    vendedor_id: number | null,
    doc_id: number | null,
    mon_id: number | null,
    mp_id: number | null,
    guia_id: number | null,
    cot_id: number | null,
    venta_subtotal: number | null,
    venta_igv: number | null,
    venta_total: number | null,
    venta_descuento: number | null,
    monto_acuenta: number | null,
    monto_pendiente: number | null,
    estado_id: number | null,
    venta_coment: string | null,
    afecta_stock: boolean | null,
    detalles: SaleDetailForm | null,
}