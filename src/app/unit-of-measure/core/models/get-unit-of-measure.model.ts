import { GetSucursalModel } from 'src/app/sucursal/core/models';
import { UnitOfMeasureModel } from './unit-of-measure.model';

export class GetUnitOfMeasureModel extends UnitOfMeasureModel {
  und_id: number = 0;
  sucursal?: GetSucursalModel | null;
}
