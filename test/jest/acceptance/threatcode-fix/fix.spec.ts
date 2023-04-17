import { fakeServer } from '../../../acceptance/fake-server';
import { runThreatcodeCLI } from '../../util/runThreatcodeCLI';
import { createProjectFromWorkspace } from '../../util/createProject';

jest.setTimeout(1000 * 60);
describe('threatcode fix', () => {
  let server: ReturnType<typeof fakeServer>;
  let env: Record<string, string>;

  beforeAll((done) => {
    const apiPath = '/api/v1';
    const apiPort = process.env.PORT || process.env.THREATCODE_PORT || '12345';
    env = {
      ...process.env,
      THREATCODE_API: 'http://localhost:' + apiPort + apiPath,
      THREATCODE_OAUTH_TOKEN: 'oauth-jwt-token',
      THREATCODE_DISABLE_ANALYTICS: '1',
    };

    server = fakeServer(apiPath, env.THREATCODE_TOKEN);
    server.listen(apiPort, () => done());
  });

  afterEach(() => {
    server.restore();
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it('succeeds when there are no vulns to fix', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runThreatcodeCLI('fix', {
      cwd: project.path(),
      env,
    });
    expect(code).toBe(0);
    expect(stdout).toMatch('No vulnerable items to fix');
    expect(stderr).toBe('');
  });

  it('fails when FF is not enabled', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runThreatcodeCLI('fix --org=no-flag', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch(
      "`threatcode fix` is not supported for org 'no-flag'.\nSee documentation on how to enable this beta feature: https://threatcode.github.io/docs/threatcode-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-threatcode-fix#enabling-threatcode-fix",
    );
    expect(stderr).toBe('');
  });

  it('fails when called with --unmanaged', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runThreatcodeCLI('fix --unmanaged', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch("`threatcode fix` is not supported for ecosystem 'cpp'");
    expect(stderr).toBe('');
  });

  it('fails when called with --docker (deprecated)', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runThreatcodeCLI('fix --docker', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch(
      "`threatcode fix` is not supported for ecosystem 'docker'",
    );
    expect(stderr).toBe('');
  });

  it('fails when called with --code', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runThreatcodeCLI('fix --code', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch("`threatcode fix` is not supported for ecosystem 'code'");
    expect(stderr).toBe('');
  });

  it('fails when api requests fail', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    server.setStatusCode(500);
    const { code, stdout, stderr } = await runThreatcodeCLI(
      'fix --org=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      {
        cwd: project.path(),
        env,
      },
    );
    expect(code).toBe(2);
    expect(stdout).toMatch('No successful fixes');
    expect(stderr).toBe('');
  });
});
