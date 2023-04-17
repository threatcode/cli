import * as Debug from 'debug';

import { getEcosystemForTest } from '../../../lib/ecosystems';

import { isFeatureFlagSupportedForOrg } from '../../../lib/feature-flags';
import { FeatureNotSupportedByEcosystemError } from '../../../lib/errors/not-supported-by-ecosystem';
import { Options, TestOptions } from '../../../lib/types';
import { AuthFailedError } from '../../../lib/errors';
import chalk from 'chalk';

const debug = Debug('threatcode-fix');
const threatcodeFixFeatureFlag = 'cliThreatcodeFix';

export async function validateFixCommandIsSupported(
  options: Options & TestOptions,
): Promise<boolean> {
  if (options.docker) {
    throw new FeatureNotSupportedByEcosystemError('threatcode fix', 'docker');
  }

  const ecosystem = getEcosystemForTest(options);
  if (ecosystem) {
    throw new FeatureNotSupportedByEcosystemError('threatcode fix', ecosystem);
  }

  const threatcodeFixSupported = await isFeatureFlagSupportedForOrg(
    threatcodeFixFeatureFlag,
    options.org,
  );

  debug('Feature flag check returned: ', threatcodeFixSupported);

  if (threatcodeFixSupported.code === 401 || threatcodeFixSupported.code === 403) {
    throw AuthFailedError(threatcodeFixSupported.error, threatcodeFixSupported.code);
  }

  if (!threatcodeFixSupported.ok) {
    const threatcodeFixErrorMessage =
      chalk.red(
        `\`threatcode fix\` is not supported${
          options.org ? ` for org '${options.org}'` : ''
        }.`,
      ) +
      '\nSee documentation on how to enable this beta feature: https://docs.threatcode.io/threatcode-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-threatcode-fix#enabling-threatcode-fix';
    const unsupportedError = new Error(threatcodeFixErrorMessage);
    throw unsupportedError;
  }

  return true;
}
