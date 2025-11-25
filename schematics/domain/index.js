/**
 * Domain Schematics Generator (CommonJS version)
 */

const {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  move,
  applyTemplates,
  mergeWith,
  chain,
} = require('@angular-devkit/schematics');

const { strings } = require('@angular-devkit/core');

/**
 * Factory export: default
 */
function generateDomain(options) {
  return (tree, _context) => {
    const domainName = strings.dasherize(options.name);
    const className = strings.classify(options.name);

    const jsonPath = `src/tools/models/${domainName}.json`;

    if (!tree.exists(jsonPath)) {
      throw new Error(`No se encontró el archivo JSON del modelo: ${jsonPath}`);
    }

    const jsonBuffer = tree.read(jsonPath);
    if (!jsonBuffer) {
      throw new Error(`No se pudo leer el archivo JSON del modelo: ${jsonPath}`);
    }

    const modelSchema = JSON.parse(jsonBuffer.toString('utf-8'));

    const targetPath = `src/app/${domainName}`;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...options,
        ...strings,
        schema: modelSchema,
        name: options.name,
        domainName,
        className,
      }),
      move(targetPath),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

module.exports = {
  default: generateDomain,
};
