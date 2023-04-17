const flatten = require('lodash.flatten');
import { PackageExpanded } from 'threatcode-resolve-deps';

export function pluckPolicies(pkg: PackageExpanded): string[] | string {
  if (!pkg) {
    return [];
  }

  if (pkg.threatcode) {
    return pkg.threatcode;
  }

  if (!pkg.dependencies) {
    return [];
  }

  return flatten(
    Object.keys(pkg.dependencies)
      .map((name: string) => pluckPolicies(pkg.dependencies[name]))
      .filter(Boolean),
  );
}
