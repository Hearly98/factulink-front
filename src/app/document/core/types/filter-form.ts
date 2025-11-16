export interface FilterForm {
  doc_nom: string | null;
  doc_tipo: string | null;
  est: boolean | null;
  order: 'asc' | 'desc' | null;
}