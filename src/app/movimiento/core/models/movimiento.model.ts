import { GetAlmacenModel } from 'src/app/almacen/core/models';
export class MovimientoModel {
  almacen_origen?: GetAlmacenModel;
  doc_numero_completo?: string;
  doc_fecha_emision?: string;
  doc_tipo_movimiento?: string;
  usuario_nombre?: string;
}
