import { createProjectFromWorkspace } from '../../util/createProject';
import { runThreatcodeCLI } from '../../util/runThreatcodeCLI';

jest.setTimeout(1000 * 30);

describe('threatcode config endpoint', () => {
  it('can set an endpoint after setting an invalid one', async () => {
    /**
     * Do not fail on errors during module import, otherwise invalid config cannot
     * be fixed by `threatcode config`. It will fail before it gets to the command.
     *
     * Config can be set through `threatcode config`, env vars and editing the
     * config JSON, so validating only at `threatcode config set` is not enough.
     */

    const validEndpoint = 'https://myendpoint.local/api';
    const invalidEndpoint = 'not-a-url';

    const project = await createProjectFromWorkspace('no-vulns');
    const runOptions = {
      cwd: project.path(),
      env: {
        ...process.env,
        THREATCODE_API: undefined,
        THREATCODE_DISABLE_ANALYTICS: '1',
        XDG_CONFIG_HOME: project.path(),
      },
    };

    {
      const { code, stdout, stderr } = await runThreatcodeCLI(
        `config set endpoint=${invalidEndpoint}`,
        runOptions,
      );
      expect(stderr).toEqual('');
      expect(stdout).toContain('endpoint updated');
      expect(code).toEqual(0);
    }

    {
      const { code, stdout, stderr } = await runThreatcodeCLI(
        `config get endpoint`,
        runOptions,
      );
      expect(stderr).toContain("Invalid 'endpoint' config option");
      expect(stdout).toEqual(invalidEndpoint + '\n');
      expect(code).toEqual(0);
    }

    {
      const { code, stdout, stderr } = await runThreatcodeCLI(
        `config set endpoint=${validEndpoint}`,
        runOptions,
      );
      /**
       *  Error will still be logged as we still validate the pre-existing
       *  invalid value before executing commands.
       */
      expect(stderr).toContain("Invalid 'endpoint' config option");
      expect(stdout).toContain('endpoint updated');
      expect(code).toEqual(0);
    }

    {
      const { code, stdout, stderr } = await runThreatcodeCLI(
        `config get endpoint`,
        runOptions,
      );
      expect(stderr).not.toContain("Invalid 'endpoint' config option");
      expect(stdout).toEqual(validEndpoint + '\n');
      expect(code).toEqual(0);
    }
  });
});
