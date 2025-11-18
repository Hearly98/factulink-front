import { GetSucursalModel } from 'src/app/sucursal/core/models';
import { RolModel } from './rol.model';

export class GetRolModel extends RolModel {
  rol_id: number = 0;
  sucursal?: GetSucursalModel | null;
}
