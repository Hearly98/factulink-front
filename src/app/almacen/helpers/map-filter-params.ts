import { FilterForm } from '../core/types';

export function mapParams(formValue: Partial<FilterForm>) {
    const params: any = {};
    if (formValue.alm_nom) params.alm_nom = formValue.alm_nom;
    if (formValue.suc_id) params.suc_id = formValue.suc_id;
    if (formValue.est !== null) params.est = formValue.est;
    return params;
}
