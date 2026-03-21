export const brandErrorMessages = () => {
  return {
    marca_codigo: {
      required: 'El código es obligatorio.',
      minLength: 'El código debe tener un mínimo de 2 caracteres.',
    },
    marca_nom: {
      required: 'El nombre es obligatorio.',
      minLength: 'El nombre debe tener un mínimo de 3 caracteres.',
    },
  };
};
