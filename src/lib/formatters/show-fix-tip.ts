import chalk from 'chalk';

import { isLocalFolder } from '../detect';
import { TestResult } from '../threatcode-test/legacy';
import { Options, SupportedProjectTypes, TestOptions } from '../types';

export function showFixTip(
  projectType: SupportedProjectTypes,
  res: TestResult,
  options: TestOptions & Options,
): string {
  const threatcodeFixSupported: SupportedProjectTypes[] = ['pip', 'poetry'];
  if (!threatcodeFixSupported.includes(projectType) || !isLocalFolder(options.path)) {
    return '';
  }

  if (!res.ok && res.vulnerabilities.length > 0) {
    return (
      `Tip: Try ${chalk.bold(
        '`threatcode fix`',
      )} to address these issues.${chalk.bold(
        '`threatcode fix`',
      )} is a new CLI command in that aims to automatically apply the recommended updates for supported ecosystems.` +
      '\nSee documentation on how to enable this beta feature: https://docs.threatcode.github.io/threatcode-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-threatcode-fix#enabling-threatcode-fix'
    );
  }

  return '';
}
