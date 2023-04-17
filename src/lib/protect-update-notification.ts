import { EOL } from 'os';
import * as theme from './theme';
import * as fs from 'fs';
import * as path from 'path';
import * as createDebug from 'debug';

const debug = createDebug('threatcode-protect-update-notification');

export function getProtectUpgradeWarningForPaths(
  packageJsonPaths: string[],
): string {
  try {
    if (packageJsonPaths?.length > 0) {
      let message = theme.color.status.warn(
        `${theme.icon.WARNING} WARNING: It looks like you have the \`threatcode\` dependency in the \`package.json\` file(s) at the following path(s):` +
          EOL,
      );

      packageJsonPaths.forEach((p) => {
        message += theme.color.status.warn(`  - ${p}` + EOL);
      });

      const githubReadmeUrlShort = 'https://threatcode.co/ud1cR'; // https://github.com/threatcode/threatcode/tree/master/packages/threatcode-protect#migrating-from-threatcode-protect-to-threatcodeprotect

      message += theme.color.status.warn(
        `For more information and migration instructions, see ${githubReadmeUrlShort}` +
          EOL,
      );

      return message;
    } else {
      return '';
    }
  } catch (e) {
    debug('Error in getProtectUpgradeWarningForPaths()', e);
    return '';
  }
}

export function packageJsonFileExistsInDirectory(
  directoryPath: string,
): boolean {
  try {
    const packageJsonPath = path.resolve(directoryPath, 'package.json');
    const fileExists = fs.existsSync(packageJsonPath);
    return fileExists;
  } catch (e) {
    debug('Error in packageJsonFileExistsInDirectory()', e);
    return false;
  }
}

export function checkPackageJsonForThreatcodeDependency(
  packageJsonPath: string,
): boolean {
  try {
    const fileExists = fs.existsSync(packageJsonPath);
    if (fileExists) {
      const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJsonObject = JSON.parse(packageJson);
      const threatcodeDependency = packageJsonObject.dependencies['threatcode'];
      if (threatcodeDependency) {
        return true;
      }
    }
  } catch (e) {
    debug('Error in checkPackageJsonForThreatcodeDependency()', e);
  }
  return false;
}

export function getPackageJsonPathsContainingThreatcodeDependency(
  fileOption: string | undefined,
  paths: string[],
): string[] {
  const packageJsonPathsWithThreatcodeDepForProtect: string[] = [];

  try {
    if (fileOption) {
      if (
        fileOption.endsWith('package.json') ||
        fileOption.endsWith('package-lock.json')
      ) {
        const directoryWithPackageJson = path.dirname(fileOption);
        if (packageJsonFileExistsInDirectory(directoryWithPackageJson)) {
          const packageJsonPath = path.resolve(
            directoryWithPackageJson,
            'package.json',
          );
          const packageJsonContainsThreatcodeDep = checkPackageJsonForThreatcodeDependency(
            packageJsonPath,
          );
          if (packageJsonContainsThreatcodeDep) {
            packageJsonPathsWithThreatcodeDepForProtect.push(packageJsonPath);
          }
        }
      }
    } else {
      paths.forEach((testPath) => {
        if (packageJsonFileExistsInDirectory(testPath)) {
          const packageJsonPath = path.resolve(testPath, 'package.json');
          const packageJsonContainsThreatcodeDep = checkPackageJsonForThreatcodeDependency(
            packageJsonPath,
          );
          if (packageJsonContainsThreatcodeDep) {
            packageJsonPathsWithThreatcodeDepForProtect.push(packageJsonPath);
          }
        }
      });
    }
  } catch (e) {
    debug('Error in getPackageJsonPathsContainingThreatcodeDependency()', e);
  }

  return packageJsonPathsWithThreatcodeDepForProtect;
}
