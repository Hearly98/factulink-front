export interface FilterForm {
  emp_nom: string | null;
  est: boolean | null;
  order: 'asc' | 'desc' | null;
}