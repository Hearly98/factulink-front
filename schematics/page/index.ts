import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export function pageGenerator(options: any): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const source = apply(url('./files'), [
      applyTemplates({
        ...options,
        ...strings
      }),
      move(`${options.path}/${strings.dasherize(options.name)}`)
    ]);

    return mergeWith(source)(_tree, context);
  };
}
