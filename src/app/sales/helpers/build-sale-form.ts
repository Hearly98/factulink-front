import { FormControl } from "@angular/forms"
import { SaleForm } from "../core/types/sale-form"

export const buildSaleForm = (): {
    [k in keyof SaleForm]: FormControl<SaleForm[k]>;
} => {
    return {
        venta_id: new FormControl(null),
        cli_id: new FormControl(null),
        afecta_stock: new FormControl(true),
        cot_id: new FormControl(null),
        detalles: new FormControl(null),
        doc_id: new FormControl(null),
        emp_id: new FormControl(null),
        estado_id: new FormControl(null),
        fecha_emision: new FormControl(null),
        fecha_vencimiento: new FormControl(null),
        guia_id: new FormControl(null),
        mon_id: new FormControl(null),
        monto_acuenta: new FormControl(null),
        monto_pendiente: new FormControl(null),
        mp_id: new FormControl(null),
        serie_id: new FormControl(null),
        suc_id: new FormControl(null),
        vendedor_id: new FormControl(null),
        venta_coment: new FormControl(null),
        venta_descuento: new FormControl(null),
        venta_igv: new FormControl(null),
        venta_subtotal: new FormControl(null),
        venta_total: new FormControl(null)
    }
}