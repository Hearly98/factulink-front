import { MovimientoModel } from "./movimiento.model";

export interface GetMovimientoModel extends MovimientoModel {
    doc_id: number;
}