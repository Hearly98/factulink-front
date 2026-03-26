import { FormControl, FormArray, Validators } from '@angular/forms';

export const buildMovimientoForm = () => ({
  mov_id: new FormControl<number | null>(null),
  mov_fec: new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
  mov_tip: new FormControl<string | null>('TRANSFERENCIA', Validators.required),
  alm_id_ori: new FormControl<number | null>(null, Validators.required),
  alm_id_des: new FormControl<number | null>(null, Validators.required),
  mov_mot: new FormControl('', Validators.required),
  mov_rec: new FormControl(''),
  con_gui_rem: new FormControl(false),
  gui_rem_num: new FormControl(''),
  gui_rem_fec: new FormControl<string | null>(null),
  gui_rem_tra: new FormControl(''),
  details: new FormArray([]),
  temp_prod_id: new FormControl<number | null>(null),
  temp_cant: new FormControl(1),
});
