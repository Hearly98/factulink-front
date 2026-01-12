import { FilterForm } from '../core/types';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
    return {
        suc_id: form.suc_id || null,
        prod_id: form.prod_id || null,
        est: form.est ?? null,
    };
}
