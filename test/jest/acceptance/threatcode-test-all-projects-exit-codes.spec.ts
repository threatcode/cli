import { fakeServer } from '../../acceptance/fake-server';
import { createProject } from '../util/createProject';
import { runThreatcodeCLI } from '../util/runThreatcodeCLI';

jest.setTimeout(1000 * 60 * 5);

describe('threatcode test --all-projects with one project that has errors', () => {
  let server;
  let env: Record<string, string>;

  beforeAll((done) => {
    const port = process.env.PORT || process.env.THREATCODE_PORT || '12345';
    const baseApi = '/api/v1';
    env = {
      ...process.env,
      THREATCODE_API: 'http://localhost:' + port + baseApi,
      THREATCODE_HOST: 'http://localhost:' + port,
      THREATCODE_TOKEN: '123456789',
      THREATCODE_DISABLE_ANALYTICS: '1',
    };
    server = fakeServer(baseApi, env.THREATCODE_TOKEN);
    server.listen(port, () => {
      done();
    });
  });

  afterEach(() => {
    server.restore();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  describe('and another that has issues (vulnerabilities)', () => {
    it('should exit with exit code 1 when the `--fail-fast` option is not set', async () => {
      const project = await createProject(
        'threatcode-test-all-projects-exit-codes/project-with-issues-and-project-with-error',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );
      const { code, stderr } = await runThreatcodeCLI(`test --all-projects`, {
        cwd: project.path(),
        env,
      });
      expect(code).toEqual(1);
      expect(stderr).toContain(
        '1/2 potential projects failed to get dependencies.',
      );
    });

    it('should exit with exit code 2 when the `--fail-fast` option is set', async () => {
      const project = await createProject(
        'threatcode-test-all-projects-exit-codes/project-with-issues-and-project-with-error',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );
      const { code, stderr } = await runThreatcodeCLI(
        `test --all-projects --fail-fast`,
        {
          cwd: project.path(),
          env,
        },
      );
      expect(code).toEqual(2);
      expect(stderr).toContain(
        '1/2 potential projects failed to get dependencies.',
      );
    });
  });

  describe('and another has no issues (vulnerabilities)', () => {
    it('should exit with exit code 0 when the `--fail-fast` option is not set', async () => {
      const project = await createProject(
        'threatcode-test-all-projects-exit-codes/project-with-no-issues-and-project-with-error',
      );
      const { code, stderr } = await runThreatcodeCLI(`test --all-projects`, {
        cwd: project.path(),
        env,
      });
      expect(code).toEqual(0);
      expect(stderr).toContain(
        '1/2 potential projects failed to get dependencies.',
      );
    });

    it('should exit with exit code 2 when the `--fail-fast` option is set', async () => {
      const project = await createProject(
        'threatcode-test-all-projects-exit-codes/project-with-no-issues-and-project-with-error',
      );
      const { code, stderr } = await runThreatcodeCLI(
        `test --all-projects --fail-fast`,
        {
          cwd: project.path(),
          env,
        },
      );
      expect(code).toEqual(2);
      expect(stderr).toContain(
        '1/2 potential projects failed to get dependencies.',
      );
    });
  });
});
