export const documentErrorMessages = () => {
  return {
    doc_cod: {
      required: 'El código es obligatorio.',
      minLength: 'Debe tener un mínimo de 2 caracteres.',
    },
    doc_nom: {
      required: 'El nombre es obligatorio.',
      minLength: 'Debe tener un mínimo de 3 caracteres.',
    },
  };
};
