import * as fs from 'fs';
import { showFixTip } from '../../../../../src/lib/formatters/show-fix-tip';
import { SupportedProjectTypes } from '../../../../../src/lib/types';
import stripAnsi from 'strip-ansi';
import { getFixturePath } from '../../../util/getFixturePath';

describe('showFixTip', () => {
  test.each(['pip', 'poetry'])('%p shows `threatcode fix` tip', (p) => {
    const withRemediation = JSON.parse(
      fs.readFileSync(
        getFixturePath(
          'npm-package-with-severity-override/test-graph-result-patches.json',
        ),
        'utf8',
      ),
    );
    expect(
      stripAnsi(
        showFixTip(p as SupportedProjectTypes, withRemediation, {
          path: 'src',
          showVulnPaths: 'none',
        }),
      ),
    ).toBe(
      'Tip: Try `threatcode fix` to address these issues.`threatcode fix` is a new CLI command in that aims to automatically apply the recommended updates for supported ecosystems.\n' +
        'See documentation on how to enable this beta feature: https://docs.threatcode.io/threatcode-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-threatcode-fix#enabling-threatcode-fix',
    );
  });

  test.each(['pip', 'poetry'])(
    '%p does not show `threatcode fix` tip when there are no issues',
    (p) => {
      const withRemediation = JSON.parse(
        fs.readFileSync(
          getFixturePath(
            'npm-package-with-severity-override/test-graph-result-patches.json',
          ),
          'utf8',
        ),
      );

      delete withRemediation.vulnerabilities;
      withRemediation.vulnerabilities = [];
      withRemediation.ok = true;
      expect(
        stripAnsi(
          showFixTip(p as SupportedProjectTypes, withRemediation, {
            path: 'src',
            showVulnPaths: 'none',
          }),
        ),
      ).toBe('');
    },
  );

  test.each([
    'k8sconfig',
    'terraformconfig',
    'cloudformationconfig',
    'customconfig',
    'multiiacconfig',
    'iac',
    'docker',
    'rubygems',
    'maven',
    'sbt',
    'gradle',
    'golangdep',
    'govendor',
    'gomodules',
    'nuget',
    'paket',
    'composer',
    'cocoapods',
    'hex',
  ])('%p shows no fix related tip', (p) => {
    const withRemediation = JSON.parse(
      fs.readFileSync(
        getFixturePath(
          'npm-package-with-severity-override/test-graph-result-patches.json',
        ),
        'utf8',
      ),
    );
    expect(
      stripAnsi(
        showFixTip(p as SupportedProjectTypes, withRemediation, {
          path: 'src',
          showVulnPaths: 'none',
        }),
      ),
    ).toBe('');
  });
});
