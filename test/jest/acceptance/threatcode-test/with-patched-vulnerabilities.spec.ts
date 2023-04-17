import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runThreatcodeCLI } from '../../util/runThreatcodeCLI';

jest.setTimeout(1000 * 30);

describe('threatcode test with patched vulnerabilities', () => {
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

  it('takes into account patched vulnerabilities', async () => {
    const project = await createProjectFromFixture(
      'project-with-patchable-dep-fixture-and-threatcode-patched',
    );

    server.setDepGraphResponse(
      await project.readJSON('test-dep-graph-response.json'),
    );

    const { stdout } = await runThreatcodeCLI('test --json', {
      cwd: project.path(),
      env,
    });

    const outputObj = JSON.parse(stdout);

    expect(outputObj).toMatchObject({
      vulnerabilities: expect.not.arrayContaining([
        expect.objectContaining({
          id: 'THREATCODE-JS-LODASH-567746',
        }),
      ]),
      filtered: {
        patch: [
          {
            id: 'THREATCODE-JS-LODASH-567746',
            patches: [
              {
                id: 'patch:THREATCODE-JS-LODASH-567746:0',
              },
            ],
            name: 'lodash',
            version: '4.17.15',
            filtered: {
              patches: [
                {
                  path: ['@threatcode/patchable-dep-fixture', 'lodash'],
                },
              ],
            },
          },
        ],
      },
    });
  });
});
