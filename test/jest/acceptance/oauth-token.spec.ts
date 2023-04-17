import { fakeServer } from '../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../util/createProject';
import { runThreatcodeCLI } from '../util/runThreatcodeCLI';

jest.setTimeout(1000 * 60);

describe('OAuth Token', () => {
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

  it('uses oauth token for authorised requests when testing projects', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code } = await runThreatcodeCLI(`test --json`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);

    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    server.getRequests().forEach((request) => {
      expect(request).toMatchObject({
        headers: {
          authorization: 'Bearer oauth-jwt-token',
        },
      });
    });
  });

  it('uses oauth token for authorised requests when monitoring projects', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code } = await runThreatcodeCLI(`monitor --json`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);
    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    server.getRequests().forEach((request) => {
      expect(request).toMatchObject({
        headers: {
          authorization: 'Bearer oauth-jwt-token',
        },
      });
    });
  });
});
