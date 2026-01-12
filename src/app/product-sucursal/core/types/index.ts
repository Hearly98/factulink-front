export * from './product-sucursal.form';

export type FilterForm = {
    prod_id?: number | null;
    suc_id?: number | null;
    est?: boolean | null;
    order?: string | null;
};
