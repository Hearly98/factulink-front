export const paymentMethodErrorMessages = () => {
  return {
    mp_nom: {
      required: 'El nombre es obligatorio.',
      minLength: 'Debe ser un mínimo de 3 caracteres.',
    },
    mp_cod: {
      required: 'El código es obligatorio.',
      minLength: 'Debe ser un mínimo de 2 caracteres.',
    },
  };
};
