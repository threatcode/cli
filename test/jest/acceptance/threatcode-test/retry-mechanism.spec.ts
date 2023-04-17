import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../../util/createProject';
import { runThreatcodeCLI } from '../../util/runThreatcodeCLI';
import { RETRY_ATTEMPTS } from '../../../../src/lib/threatcode-test/common';

jest.setTimeout(2000 * 60);

describe('threatcode test retry mechanism', () => {
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

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test('run `threatcode test` on an arbitrary cocoapods project and expect retries in case of failures', async () => {
    const project = await createProjectFromWorkspace('cocoapods-app');
    const statuses = Array(RETRY_ATTEMPTS - 1)
      .fill(500)
      .concat([200]);
    server.setStatusCodes(statuses);

    const { code } = await runThreatcodeCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);
  });

  test('run `threatcode test` on an arbitrary cocoapods project and expect failure when the retry budget is consumed', async () => {
    const project = await createProjectFromWorkspace('cocoapods-app');
    server.setStatusCodes(Array(RETRY_ATTEMPTS).fill(500));

    const { code } = await runThreatcodeCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(2);
  });
});
