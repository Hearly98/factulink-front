export const customerErrorMessages = () => {
  return {
    cli_nom: {
      required: 'El nombre es obligatorio',
      minLength: 'El nombre debe tener un mínimo de 3 caracteres',
    },
    tip_id: {
      required: 'El tipo de documento es obligatorio',
    },
    cli_documento: {
      required: 'El documento es obligatorio',
    },
    cli_telf: {
      required: 'El telefono es obligatorio'
    },
    cli_correo: {
      required: 'El correo es obligatorio',
      email: 'No es un email válido'
    },
  };
};
