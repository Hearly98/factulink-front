import { SaleForm } from "./sale-form";

export type CreateSaleModel = Omit<SaleForm, 'venta_id'>;

