export const userStructure = [
  {
    label: 'Nombre',
    formControlName: 'usu_nom',
    type: 'text',
    col: 12,
  },
  {
    label: 'Apellidos',
    formControlName: 'usu_ape',
    type: 'text',
    col: 12,
  },
  {
    label: 'Email',
    formControlName: 'email',
    type: 'email',
    col: 12,
  },
  {
    label: 'Contraseña',
    formControlName: 'password',
    type: 'password',
    col: 12,
  },
  {
    label: 'Documento',
    formControlName: 'usu_dni',
    type: 'text',
    col: 6,
  },
  {
    label: 'Teléfono',
    formControlName: 'usu_telf',
    type: 'text',
    col: 6,
  },
  {
    label: 'Rol',
    formControlName: 'rol_id',
    type: 'select',
    col: 6,
    options: []
  },
];
