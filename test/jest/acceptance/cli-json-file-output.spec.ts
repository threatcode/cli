import { fakeServer } from '../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../util/createProject';
import { runThreatcodeCLI } from '../util/runThreatcodeCLI';

jest.setTimeout(1000 * 60);

describe('test --json-file-output', () => {
  let server: ReturnType<typeof fakeServer>;
  let env: Record<string, string>;

  beforeAll((done) => {
    const apiPath = '/api/v1';
    const apiPort = process.env.PORT || process.env.THREATCODE_PORT || '12345';
    env = {
      ...process.env,
      THREATCODE_API: 'http://localhost:' + apiPort + apiPath,
      THREATCODE_TOKEN: '123456789',
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

  it('test with --json returns without error and with JSON return type when no vulns found', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code, stdout } = await runThreatcodeCLI(`test --json`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);

    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    const outputObj = JSON.parse(stdout);
    expect(outputObj).not.toBe('');
  });

  it('test without --json returns without error and with a string return type when no vulns found', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code, stdout } = await runThreatcodeCLI(`test`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);

    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    expect(stdout).not.toBe('');
    expect(typeof stdout).toBe('string');
  });

  it('test with --json throws error and error contains json output with vulnerabilities when vulns found', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-fixable');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code, stdout } = await runThreatcodeCLI(`test --json`, {
      cwd: project.path(),
      env,
    });

    const returnedJson = JSON.parse(stdout);
    expect(returnedJson.vulnerabilities.length > 0).toBeTruthy();
    expect(code).toEqual(1);
    expect(stdout).not.toBe('');
  });

  it('can save JSON output to file while sending human readable output to stdout', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const outputPath = 'json-file-output.json';

    const { code, stdout } = await runThreatcodeCLI(
      `test --json-file-output=${outputPath}`,
      {
        cwd: project.path(),
        env,
      },
    );

    expect(code).toEqual(0);
    expect(stdout).toMatch('Organization:');
    expect(await project.readJSON(outputPath)).toMatchObject({ ok: true });
  });

  it('test --json-file-output produces same JSON output as normal JSON output to stdout', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const outputPath = 'json-file-output.json';

    const { code, stdout } = await runThreatcodeCLI(
      `test --json --json-file-output=${outputPath}`,
      {
        cwd: project.path(),
        env,
      },
    );

    expect(code).toEqual(0);
    expect(await project.read(outputPath)).toEqual(stdout);
  });
});
