import { FormControl } from '@angular/forms';
import { StockFilterForm } from '../core/types/stock-filter-form';

export const buildStockFilterForm = (): {
  [K in keyof StockFilterForm]: FormControl<StockFilterForm[K]>;
} => ({
  suc_id: new FormControl(null),
  prod_nom: new FormControl(null),
  prod_cod_interno: new FormControl(null),
});
