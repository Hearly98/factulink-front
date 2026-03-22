export const currencyErrorMessages = () => {
  return {
    mon_nom: {
      required: 'El nombre es obligatorio.',
      minLength: 'Debe ser mínimo de 3 caracteres.',
    },
    mon_cod: {
      required: 'El código es obligatorio.',
      minLength: 'Debe ser mínimo de 2 caracteres.',
    },
    mon_simbolo: {
      required: 'El simbolo es obligatorio.',
    },
  };
};
