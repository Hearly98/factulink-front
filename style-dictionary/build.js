import StyleDictionary from 'style-dictionary';

/**
 * 🛠️ Utilidad: Convierte un código HEX a una cadena de valores RGB separados por coma.
 * @param {string} hex - El valor HEX del color (ej: #00a24f)
 * @returns {string} - Cadena R, G, B (ej: 0, 162, 79)
 */
const hexToRgbValues = (hex) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
    
    // Simplificar forma abreviada (ej. #03F -> #0033FF)
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex; // Retorna original si no es un color HEX válido

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // Retorna la cadena R, G, B
    return `${r}, ${g}, ${b}`;
};

/**
 * 🔧 Transform: Convierte colores a valores R, G, B sin la función rgb().
 */
StyleDictionary.registerTransform({
    name: 'color/rgb-values',
    type: 'value',
    transitive: true,
    filter: (token) => token.type === 'color',
    transform: (token) => {
        // Accedemos a la propiedad 'original.value' para obtener el HEX antes de cualquier otra transformación.
        return hexToRgbValues(token.original.value);
    },
});

/**
 * 🎨 Formato SCSS que exporta todos los tokens.
 * El sufijo '-rgb' y el valor R,G,B ya están aplicados por los transforms.
 */
StyleDictionary.registerFormat({
  name: 'scss/variables-rgb-suffix',
  format: ({ dictionary }) => {
    // Genera variables SCSS válidas: $token-name: value;
    const scssVars = dictionary.allTokens
      .map((t) => `$${t.name}: ${t.value};`)
      .join('\n');
      
    if (scssVars.trim() === '') return ''; 

    return `// Tokens con sufijo -rgb generados por Style Dictionary\n${scssVars}`;
  },
});

/**
 * 🔧 Transform: Añade el sufijo '-rgb' al nombre del token.
 * Se aplica a TODOS los tokens en la plataforma SCSS-RGB, como solicitaste.
 */
StyleDictionary.registerTransform({
    name: 'name/append-rgb',
    type: 'name',
    matcher: () => true, // Aplica a TODOS los tokens
    transform: (token) => `${token.name}-rgb`, 
});

/**
 * 🧱 Filtro: Solo incluye tokens de tipo 'color'.
 */
StyleDictionary.registerFilter({
  name: 'color',
  // FIX: Cambiado 'matcher' a 'filter' para corregir el error de registro.
  filter: (token) => token.type === 'color', 
});


/**
 * 🧱 Config principal
 */
const config = {
  source: ['style-dictionary/tokens/**/*.json'],
  
  platforms: {
    // 1. SCSS (HEX) - Mantiene todos los colores en HEX.
    "scss-hex": {
      transformGroup: 'scss',
      buildPath: 'src/scss/tokens/hex/',
      files: [
        {
          destination: '_tokens-hex.scss',
          format: 'scss/variables',
        },
      ],
    },
    // 2. SCSS (RGB) - Convierte el valor de color a R, G, B y renombra TODOS los tokens.
    "scss-rgb": {
      buildPath: 'src/scss/tokens/rgb/',
      transforms: [
        'attribute/cti',
        'name/kebab', 
        'color/rgb-values', // <--- Usa el nuevo transform que retorna R, G, B
        'size/rem',
        'name/append-rgb' // <--- Renombra CADA token
      ],
      files: [
        {
          destination: '_tokens-rgb.scss',
          format: 'scss/variables-rgb-suffix',
          filter: 'color', // Solo escribe tokens de color
        },
      ],
    },
    // 3. CSS - Mantiene los valores transformados en RGB (función rgb()).
    css: {
      transformGroup: 'css',
      buildPath: 'src/scss/tokens/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
  },
};

const SD = new StyleDictionary(config);

SD.buildAllPlatforms();
console.log('✅ Tokens generados correctamente');
