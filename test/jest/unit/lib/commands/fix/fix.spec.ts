import * as pathLib from 'path';
import * as fs from 'fs';
import * as threatcodeFix from '@threatcode/fix';
import fix from '../../../../../../src/cli/commands/fix';
import * as threatcode from '../../../../../../src/lib';
import * as featureFlags from '../../../../../../src/lib/feature-flags';
import * as analytics from '../../../../../../src/lib/analytics';
import stripAnsi from 'strip-ansi';
import { getWorkspacePath } from '../../../../util/getWorkspacePath';
import { getFixturePath } from '../../../../util/getFixturePath';

const testTimeout = 100000;

const pipAppWorkspace = getWorkspacePath('pip-app');
const npmWorkspace = getWorkspacePath('no-vulns');
const pipRequirementsTxt = pathLib.join(pipAppWorkspace, 'requirements.txt');
const pipRequirementsCustomTxt = getWorkspacePath('pip-app-custom/base.txt');

const pipWithRemediation = JSON.parse(
  fs.readFileSync(
    getFixturePath('threatcode-fix/test-result-pip-with-remediation.json'),
    'utf8',
  ),
);

const pipNoIssues = JSON.parse(
  fs.readFileSync(
    getFixturePath('threatcode-fix/test-result-pip-no-vulns.json'),
    'utf8',
  ),
);

describe('threatcode fix (functional tests)', () => {
  let origStdWrite;
  let threatcodeFixSpy: jest.SpyInstance;
  let addAnalyticsSpy: jest.SpyInstance;

  beforeAll(async () => {
    origStdWrite = process.stdout.write;
    jest
      .spyOn(featureFlags, 'isFeatureFlagSupportedForOrg')
      .mockResolvedValue({ ok: true });
  });

  beforeEach(() => {
    threatcodeFixSpy = jest.spyOn(threatcodeFix, 'fix');
    addAnalyticsSpy = jest.spyOn(analytics, 'add');
  });

  afterEach(() => {
    threatcodeFixSpy.mockClear();
    addAnalyticsSpy.mockClear();
  });

  afterAll(async () => {
    process.stdout.write = origStdWrite;
    jest.clearAllMocks();
  });
  it(
    'shows successful fixes Python requirements.txt project was fixed via --file',
    async () => {
      let stdoutMessages = '';
      process.stdout.write = (str) => {
        stdoutMessages += str;
        return true;
      };

      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipWithRemediation,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsTxt,
      });
      const res = await fix('.', {
        file: pipRequirementsTxt,
        dryRun: true, // prevents write to disc
        quiet: true,
        _doubleDashArgs: [],
        _: [],
      });
      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(9);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        1,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 4);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixErrors', {
        python: [],
      });

      expect(stripAnsi(res)).toMatch('✔ Upgraded Jinja2 from 2.7.2 to 2.11.3');
      expect(stdoutMessages).toEqual('');
    },
    testTimeout,
  );
  it(
    'shows successful fixes Python requirements.txt project on stdout',
    async () => {
      let stdoutMessages = '';
      process.stdout.write = (str) => {
        stdoutMessages += str;
        return true;
      };
      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipWithRemediation,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsTxt,
      });
      const res = await fix('.', {
        file: pipRequirementsTxt,
        dryRun: true, // prevents write to disc
        _doubleDashArgs: [],
        _: [],
      });
      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
      });
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(9);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        1,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 4);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixErrors', {
        python: [],
      });

      expect(stripAnsi(res)).toMatch('✔ Upgraded Jinja2 from 2.7.2 to 2.11.3');
      expect(stripAnsi(stdoutMessages)).toMatch(
        '✔ Looking for supported Python items',
      );
    },
    testTimeout,
  );
  it(
    'shows successful fixes Python custom name base.txt project was fixed via --file',
    async () => {
      // read data from console.log
      let stdoutMessages = '';
      let stderrMessages = '';
      jest
        .spyOn(console, 'log')
        .mockImplementation((msg: string) => (stdoutMessages += msg));
      jest
        .spyOn(console, 'error')
        .mockImplementation((msg: string) => (stderrMessages += msg));

      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipWithRemediation,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsCustomTxt,
      });
      const res = await fix('.', {
        file: pipRequirementsCustomTxt,
        packageManager: 'pip',
        dryRun: true, // prevents write to disc
        quiet: true,
        _doubleDashArgs: [],
        _: [],
      });
      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });

      expect(addAnalyticsSpy).toHaveBeenCalledTimes(9);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        1,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 4);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixErrors', {
        python: [],
      });

      expect(stripAnsi(res)).toMatch('✔ Upgraded Jinja2 from 2.7.2 to 2.11.3');
      expect(stdoutMessages).toEqual('');
      expect(stderrMessages).toEqual('');
    },
    testTimeout,
  );

  it(
    'threatcode fix continues to fix when 1 path fails to test with `threatcode fix path1 path2` (exit code 0)',
    async () => {
      // read data from console.log
      let stdoutMessages = '';
      let stderrMessages = '';
      jest
        .spyOn(console, 'log')
        .mockImplementation((msg: string) => (stdoutMessages += msg));
      jest
        .spyOn(console, 'error')
        .mockImplementation((msg: string) => (stderrMessages += msg));

      jest
        .spyOn(threatcode, 'test')
        .mockRejectedValueOnce(new Error('Failed to get npm dependencies'));
      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipWithRemediation,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsTxt,
      });
      const res = await fix(npmWorkspace, pipAppWorkspace, {
        dryRun: true, // prevents write to disc
        quiet: true,
        _doubleDashArgs: [],
        _: [],
      });
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(9);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        1,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 3);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 4);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixErrors', {
        python: [],
      });

      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(stripAnsi(res)).toMatch('✔ Upgraded Jinja2 from 2.7.2 to 2.11.3');
      // only use ora to output
      expect(stdoutMessages).toEqual('');
      expect(stderrMessages).toEqual('');
    },
    testTimeout,
  );

  it(
    'threatcode fix send errors as analytics when fix fails',
    async () => {
      // read data from console.log
      let stdoutMessages = '';
      let stderrMessages = '';
      jest
        .spyOn(console, 'log')
        .mockImplementation((msg: string) => (stdoutMessages += msg));
      jest
        .spyOn(console, 'error')
        .mockImplementation((msg: string) => (stderrMessages += msg));
      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipWithRemediation,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsTxt,
      });
      threatcodeFixSpy.mockResolvedValueOnce({
        results: {
          python: {
            failed: [
              {
                original: [],
                error: new Error(
                  'SolverProblemError Because x (2.6) depends on y (>=1.19)',
                ),
                tip: 'Try running `pipenv install x==2.6 transitive==1.1.1',
              },
              {
                original: [],
                changes: [
                  {
                    success: false,
                    userMessage: 'Failed ot upgrade x to y',
                    reason: 'Incompatible dependencies',
                  },
                ],
              },
            ],
            skipped: [],
            succeeded: [],
          },
        },
        exceptions: {},
        meta: {
          fixed: 0,
          failed: 1,
          fixableIssues: 14,
          fixedIssues: 0,
          totalIssues: 14,
        },
        fixSummary: '✖ No successful fixes',
      });

      let res;
      try {
        res = await fix(pipAppWorkspace, {
          dryRun: true,
          quiet: true,
          _doubleDashArgs: [],
          _: [],
        });
      } catch (e) {
        res = e.message;
      }

      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(9);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        1,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 14);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 14);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );

      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixErrors', {
        python: [
          'SolverProblemError Because x (2.6) depends on y (>=1.19)',

          JSON.stringify({
            success: false,
            userMessage: 'Failed ot upgrade x to y',
            reason: 'Incompatible dependencies',
          }),
        ],
      });

      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(stripAnsi(res)).toMatch('✖ No successful fixes');
      // only use ora to output
      expect(stdoutMessages).toEqual('');
      expect(stderrMessages).toEqual('');
    },
    testTimeout,
  );

  it(
    'threatcode fails to fix when all paths fails to test with `threatcode fix path1 path2` (non 0 error code)',
    async () => {
      // read data from console.log
      let stdoutMessages = '';
      let stderrMessages = '';
      jest
        .spyOn(console, 'log')
        .mockImplementation((msg: string) => (stdoutMessages += msg));
      jest
        .spyOn(console, 'error')
        .mockImplementation((msg: string) => (stderrMessages += msg));

      jest
        .spyOn(threatcode, 'test')
        .mockRejectedValue(new Error('Failed to get dependencies'));

      let res;
      try {
        await fix(npmWorkspace, pipAppWorkspace, {
          dryRun: true, // prevents write to disc
          quiet: true,
          _doubleDashArgs: [],
          _: [],
        });
      } catch (error) {
        res = error;
      }
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(8);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        0,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );

      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });
      expect(stripAnsi(res.message)).toMatch('No successful fixes');
      expect(stdoutMessages).toEqual('');
      expect(stderrMessages).toEqual('');
    },
    testTimeout,
  );

  it(
    'threatcode succeeds to fix when no vulns `threatcode fix path1` (exit code 0)',
    async () => {
      // read data from console.log
      let stdoutMessages = '';
      let stderrMessages = '';
      jest
        .spyOn(console, 'log')
        .mockImplementation((msg: string) => (stdoutMessages += msg));
      jest
        .spyOn(console, 'error')
        .mockImplementation((msg: string) => (stderrMessages += msg));

      jest.spyOn(threatcode, 'test').mockResolvedValue({
        ...pipNoIssues,
        // pip plugin does not return targetFile, instead fix will fallback to displayTargetFile
        displayTargetFile: pipRequirementsTxt,
      });
      const res = await fix(pipAppWorkspace, {
        dryRun: true, // prevents write to disc
        quiet: true,
        _doubleDashArgs: [],
        _: [],
      });
      expect(threatcodeFixSpy).toHaveBeenCalledTimes(1);
      expect(threatcodeFixSpy.mock.calls[0][1]).toEqual({
        dryRun: true,
        quiet: true,
      });
      expect(addAnalyticsSpy).toHaveBeenCalledTimes(8);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFailedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedProjects', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalProjects', 1);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixVulnerableProjects',
        0,
      );
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixableIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixFixedIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith('threatcodeFixTotalIssues', 0);
      expect(addAnalyticsSpy).toHaveBeenCalledWith(
        'threatcodeFixSummary',
        expect.any(String),
      );

      expect(stripAnsi(res)).toMatch('✔ No vulnerable items to fix');
      expect(stdoutMessages).toEqual('');
      expect(stderrMessages).toEqual('');
    },
    testTimeout,
  );
});
