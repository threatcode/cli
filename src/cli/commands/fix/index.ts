import * as Debug from 'debug';
import * as threatcodeFix from '@threatcode/fix';
import * as ora from 'ora';

import { MethodArgs } from '../../args';
import * as threatcode from '../../../lib';
import { TestResult } from '../../../lib/threatcode-test/legacy';
import * as analytics from '../../../lib/analytics';

import { convertLegacyTestResultToFixEntities } from './convert-legacy-tests-results-to-fix-entities';
import { formatTestError } from '../test/format-test-error';
import { processCommandArgs } from '../process-command-args';
import { validateCredentials } from '../test/validate-credentials';
import { validateTestOptions } from '../test/validate-test-options';
import { setDefaultTestOptions } from '../test/set-default-test-options';
import { validateFixCommandIsSupported } from './validate-fix-command-is-supported';
import { Options, TestOptions } from '../../../lib/types';
import { getDisplayPath } from './get-display-path';
import chalk from 'chalk';
import { icon, color } from '../../../lib/theme';
import { checkOSSPaths } from '../../../lib/check-paths';

const debug = Debug('threatcode-fix');
const threatcodeFixFeatureFlag = 'cliThreatcodeFix';

interface FixOptions {
  dryRun?: boolean;
  quiet?: boolean;
  sequential?: boolean;
}
export default async function fix(...args: MethodArgs): Promise<string> {
  const { options: rawOptions, paths } = await processCommandArgs<FixOptions>(
    ...args,
  );
  const options = setDefaultTestOptions<FixOptions>(rawOptions);
  debug(options);
  await validateFixCommandIsSupported(options);

  if (!options.docker) {
    checkOSSPaths(paths, rawOptions);
  }

  validateTestOptions(options);
  validateCredentials(options);
  const results: threatcodeFix.EntityToFix[] = [];
  results.push(...(await runThreatcodeTestLegacy(options, paths)));
  // fix
  debug(
    `Organization has ${threatcodeFixFeatureFlag} feature flag enabled for experimental Threatcode fix functionality`,
  );
  const vulnerableResults = results.filter(
    (res) => Object.keys(res.testResult.issues).length,
  );
  const { dryRun, quiet, sequential: sequentialFix } = options;
  const { fixSummary, meta, results: resultsByPlugin } = await threatcodeFix.fix(
    results,
    {
      dryRun,
      quiet,
      sequentialFix,
    },
  );

  setThreatcodeFixAnalytics(
    fixSummary,
    meta,
    results,
    resultsByPlugin,
    vulnerableResults,
  );
  // `threatcode test` did not return any test results
  if (results.length === 0) {
    throw new Error(fixSummary);
  }
  // `threatcode test` returned no vulnerable results, so nothing to fix
  if (vulnerableResults.length === 0) {
    return fixSummary;
  }
  // `threatcode test` returned vulnerable results
  // however some errors occurred during `threatcode fix` and nothing was fixed in the end
  const anyFailed = meta.failed > 0;
  const noneFixed = meta.fixed === 0;
  if (anyFailed && noneFixed) {
    throw new Error(fixSummary);
  }
  return fixSummary;
}

/* @deprecated
 * TODO: once project envelope is default all code below will be deleted
 * we should be calling test via new Ecosystems instead
 */
async function runThreatcodeTestLegacy(
  options: Options & TestOptions & FixOptions,
  paths: string[],
): Promise<threatcodeFix.EntityToFix[]> {
  const results: threatcodeFix.EntityToFix[] = [];
  const stdOutSpinner = ora({
    isSilent: options.quiet,
    stream: process.stdout,
  });
  const stdErrSpinner = ora({
    isSilent: options.quiet,
    stream: process.stdout,
  });
  stdErrSpinner.start();
  stdOutSpinner.start();

  for (const path of paths) {
    let displayPath = path;
    const spinnerMessage = `Running \`threatcode test\` for ${displayPath}`;

    try {
      displayPath = getDisplayPath(path);
      stdOutSpinner.text = spinnerMessage;
      stdOutSpinner.render();
      // Create a copy of the options so a specific test can
      // modify them i.e. add `options.file` etc. We'll need
      // these options later.
      const threatcodeTestOptions = {
        ...options,
        path,
        projectName: options['project-name'],
      };

      const testResults: TestResult[] = [];

      const testResultForPath: TestResult | TestResult[] = await threatcode.test(
        path,
        { ...threatcodeTestOptions, quiet: true },
      );
      testResults.push(
        ...(Array.isArray(testResultForPath)
          ? testResultForPath
          : [testResultForPath]),
      );
      const newRes = convertLegacyTestResultToFixEntities(
        testResults,
        path,
        options,
      );
      results.push(...newRes);
      stdOutSpinner.stopAndPersist({
        text: spinnerMessage,
        symbol: `\n${icon.RUN}`,
      });
    } catch (error) {
      const testError = formatTestError(error);
      const userMessage =
        color.status.error(`Failed! ${testError.message}.`) +
        `\n  Tip: run \`threatcode test ${displayPath} -d\` for more information.`;
      stdOutSpinner.stopAndPersist({
        text: spinnerMessage,
        symbol: `\n${icon.RUN}`,
      });
      stdErrSpinner.stopAndPersist({
        text: userMessage,
        symbol: chalk.red(' '),
      });
      debug(userMessage);
    }
  }
  stdOutSpinner.stop();
  stdErrSpinner.stop();
  return results;
}

function setThreatcodeFixAnalytics(
  fixSummary: string,
  meta: threatcodeFix.FixedMeta,
  threatcodeTestResponses: threatcodeFix.EntityToFix[],
  resultsByPlugin: threatcodeFix.FixHandlerResultByPlugin,
  vulnerableResults: threatcodeFix.EntityToFix[],
) {
  // Analytics # of projects
  analytics.add('threatcodeFixFailedProjects', meta.failed);
  analytics.add('threatcodeFixFixedProjects', meta.fixed);
  analytics.add('threatcodeFixTotalProjects', threatcodeTestResponses.length);
  analytics.add('threatcodeFixVulnerableProjects', vulnerableResults.length);

  // Analytics # of issues
  analytics.add('threatcodeFixFixableIssues', meta.fixableIssues);
  analytics.add('threatcodeFixFixedIssues', meta.fixedIssues);
  analytics.add('threatcodeFixTotalIssues', meta.totalIssues);

  analytics.add('threatcodeFixSummary', fixSummary);

  // Analytics for errors
  for (const plugin of Object.keys(resultsByPlugin)) {
    const errors: string[] = [];
    const failedToFix = resultsByPlugin[plugin].failed;
    for (const failed of failedToFix) {
      if ('error' in failed) {
        errors.push(failed.error.message);
      }
      if ('changes' in failed) {
        errors.push(...failed.changes.map((f) => JSON.stringify(f)));
      }
    }
    analytics.add('threatcodeFixErrors', { [plugin]: errors });
  }
}
