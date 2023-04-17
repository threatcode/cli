import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runThreatcodeCLI } from '../../util/runThreatcodeCLI';
import { isCLIV2 } from '../../util/isCLIV2';

jest.setTimeout(1000 * 30);

describe('analytics module', () => {
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
      THREATCODE_INTEGRATION_NAME: 'JENKINS',
      THREATCODE_INTEGRATION_VERSION: '1.2.3',
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

  it('detects upgradable protect paths with `threatcode test` with upgradable path in the cwd', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-with-threatcode-dep',
    );

    const { code, stdout } = await runThreatcodeCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `threatcode` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-threatcode-protect-paths': 1,
          },
        },
      },
    });
  });

  it('detects upgradable protect paths with `threatcode test` using `--file=`', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-with-threatcode-dep',
    );

    const pathToFile = project.path('package-lock.json');
    const { code, stdout } = await runThreatcodeCLI(`test --file=${pathToFile}`, {
      // note: not passing in the `cwd` of the project object
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `threatcode` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-threatcode-protect-paths': 1,
          },
        },
      },
    });
  });

  it('detects upgradable protect paths with `threatcode test` using paths as positional args', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification',
    );

    const paths = [
      project.path('with-package-json-with-threatcode-dep'),
      project.path('with-package-json-with-threatcode-dep-2'),
      project.path('with-package-json-without-threatcode-dep'),
    ];

    const pathsStr = paths.join(' ');

    const { code, stdout } = await runThreatcodeCLI(`test ${pathsStr}`, {
      // note: not passing in the `cwd` of the project object
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `threatcode` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(
      project.path('with-package-json-with-threatcode-dep/package.json'),
    );
    expect(stdout).toContain(
      project.path('with-package-json-with-threatcode-dep-2/package.json'),
    );
    expect(stdout).not.toContain(
      project.path('with-package-json-without-threatcode-dep/package.json'),
    );

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-threatcode-protect-paths': 2,
          },
        },
      },
    });
  });

  it('detects no upgradable protect paths with `threatcode test` with no upgradable paths in the cwd', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-without-threatcode-dep',
    );

    const { code, stdout } = await runThreatcodeCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toBe(0);
    expect(stdout).not.toContain(
      'WARNING: It looks like you have the `threatcode` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).not.toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-threatcode-protect-paths': 0,
          },
        },
      },
    });
  });
});
