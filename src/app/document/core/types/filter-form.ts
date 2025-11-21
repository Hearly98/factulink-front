export interface FilterForm {
  doc_nom: string | null;
  est: boolean | null;
  order: 'asc' | 'desc' | null;
}