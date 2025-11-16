export interface FilterForm {
  com_nom: string | null;
  est: boolean | null;
  order: 'asc' | 'desc' | null;
}