export interface FilterForm {
  mon_nom: string | null;
  est: boolean | null;
  suc_id: number | null;
  order: 'asc' | 'desc' | null;
}