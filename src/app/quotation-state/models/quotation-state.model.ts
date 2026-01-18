export class QuotationStateModel {
    codigo: string = '';
    nombre: string = '';
    descripcion: string = '';
    color: 'warning' | 'success' | 'danger' = 'warning';
    est: boolean = false;
}