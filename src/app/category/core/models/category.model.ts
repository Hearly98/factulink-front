export class CategoryModel {
    emp_id: number = 0;
    cat_nom: string = '';
    est: boolean = true;
    empresa?: {
        emp_id: number;
        emp_nom: string;
    } | null = null;
}
