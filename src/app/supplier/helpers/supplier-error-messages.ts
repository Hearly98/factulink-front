export const supplierErrorMessages = () => {
  return {
    prov_nom: {
      required: 'El nombre es obligatorio',
      minLength: 'El nombre debe tener un mínimo de 3 caracteres',
    },
    prov_direcc: {
      required: 'La dirección es obligatoria',
      minLength: 'La dirección tiene un mínimo de 3 caracteres',
    },
    cli_documento: {
      required: 'El documento es obligatorio',
    },
    prov_correo: {
      required: 'El correo es obligatorio',
      email: 'No es un email válido',
    },
    tip_id: {
      required: 'El Tipo Documento es obligatorio',
    },
    prov_documento: {
      required: 'El Documento es obligatorio',
    },
    prov_telf: {
      fromEventPattern: 'El Telefono debe ser válido',
    },
  };
};
