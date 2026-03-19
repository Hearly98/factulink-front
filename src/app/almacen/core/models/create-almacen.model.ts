import { AlmacenModel } from './almacen.model';

export class CreateAlmacenModel extends AlmacenModel { }

export class UpdateAlmacenModel extends AlmacenModel {
    alm_id: number = 0;
}
