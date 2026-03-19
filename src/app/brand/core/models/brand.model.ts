export class MarcaModel {
  emp_id: number = 0;
  marca_codigo: string = '';
  marca_nom: string = '';
  est: boolean = true;
  empresa?: {
    emp_id: number;
    emp_nom: string;
  } | null = null;
}
