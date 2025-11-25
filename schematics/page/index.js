/**
 * Page Schematics Generator (CommonJS version)
 */
const {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
} = require('@angular-devkit/schematics');
const { strings } = require('@angular-devkit/core');

function pageGenerator(options) {
  return () => {
    const targetPath = `${options.path}/${strings.dasherize(options.name)}`;

    const source = apply(url('./files'), [
      applyTemplates({
        ...options,
        ...strings,
      }),
      move(targetPath),
    ]);

    return mergeWith(source);
  };
}

module.exports = {
  default: pageGenerator,
};

