const { apply, url, move, applyTemplates, mergeWith } = require('@angular-devkit/schematics');
const { strings } = require('@angular-devkit/core');
const fs = require('fs');

function parseProps(propsString) {
  const props = {};
  if (!propsString) return props;

  propsString.split(',').forEach(pair => {
    const [key, type] = pair.split(':').map(x => x.trim());
    if (key && type) props[key] = type;
  });

  return props;
}

function modelGenerator(options) {
  return (_tree, _context) => {
    const name = strings.dasherize(options.name);
    const className = strings.classify(options.name);

    let schemaData = null;

    const jsonPath = `src/tools/models/${name}.json`;

    // ---------- If JSON exists OR user does not disable it ----------
    if (fs.existsSync(jsonPath) && options.useJson !== false) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      schemaData = JSON.parse(raw);
    }

    // ---------- If JSON does NOT exist, build schema manually ----------
    if (!schemaData) {
      if (!options.id || !options.props) {
        throw new Error(
          `No existe JSON del modelo y faltan parámetros.\n` +
          `Debes pasar: --id=xxx --props="campo1:tipo, campo2:tipo"`
        );
      }

      schemaData = {
        className,
        id: options.id,
        properties: parseProps(options.props)
      };
    }

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        name,
        className,
        schema: schemaData
      }),
      move(`src/app/${name}/core/models`)
    ]);

    return mergeWith(templateSource);
  };
}

module.exports = { default: modelGenerator };
