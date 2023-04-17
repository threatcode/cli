import { runThreatcodeCLI } from '../util/runThreatcodeCLI';
import { fakeServer } from '../../acceptance/fake-server';
import { isCLIV2 } from '../util/isCLIV2';

jest.setTimeout(1000 * 30); // 30 seconds

describe('cli token precedence', () => {
  let server: ReturnType<typeof fakeServer>;
  let env: Record<string, string>;
  let initialConfig: Record<string, string> = {};

  const port = process.env.PORT || process.env.THREATCODE_PORT || '12345';
  const baseApi = '/api/v1';
  const initialEnvVars = {
    ...process.env,
    THREATCODE_API: 'http://localhost:' + port + baseApi,
    THREATCODE_HOST: 'http://localhost:' + port,
  };

  beforeAll((done) => {
    env = initialEnvVars;
    server = fakeServer(baseApi, 'threatcodeToken');
    server.listen(port, () => {
      done();
    });
  });

  beforeAll(async () => {
    // save initial config
    const { stdout } = await runThreatcodeCLI('config', { env });
    if (stdout) {
      initialConfig = stdout
        .trim()
        .split('\n')
        .reduce((acc, line) => {
          const [key, value] = line.split(': ');
          return {
            ...acc,
            [key]: value,
          };
        }, {});
    }
  });

  afterEach(async () => {
    server.restore();
    env = initialEnvVars;

    // reset config to initial state
    await runThreatcodeCLI('config clear', { env });
    if (Object.keys(initialConfig).length > 0) {
      for (const key in initialConfig) {
        await runThreatcodeCLI(`config set ${key}=${initialConfig[key]}`, { env });
      }
    }
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  type AuthConfig = {
    name: string;
    expectedAuthType: string;
    expectedToken: string;
    threatcodeConfig?: Record<string, string>;
  };

  const threatcodeAPIConfig: AuthConfig = {
    name: 'threatcodeAPI',
    expectedAuthType: 'token',
    expectedToken: 'threatcodeApiToken',
    threatcodeConfig: {
      api: 'threatcodeApiToken',
    },
  };

  const internalOAuthTokenStorage = {
    access_token: 'configAccessToken',
    token_type: 'Bearer',
    refresh_token: 'configRefreshToken',
    expiry: '3023-03-29T17:47:13.714448+02:00',
  };
  const threatcodeOAuthConfig: AuthConfig = {
    name: 'threatcodeOAuth',
    expectedAuthType: 'Bearer',
    expectedToken: 'configAccessToken',
    threatcodeConfig: {
      internal_oauth_token_storage: JSON.stringify(internalOAuthTokenStorage),
      internal_threatcode_oauth_enabled: '1',
    },
  };

  [threatcodeAPIConfig, threatcodeOAuthConfig].forEach((auth) => {
    describe(`when ${auth.name} is set in config`, () => {
      beforeEach(async () => {
        // inject config
        for (const key in auth.threatcodeConfig) {
          await runThreatcodeCLI(`config set ${key}=${auth.threatcodeConfig[key]}`);
        }
      });

      if (isCLIV2()) {
        it(`should use ${auth.name} auth type set in config`, async () => {
          await runThreatcodeCLI(`-d`, { env });
          const authHeader = server.popRequest().headers?.authorization;
          expect(authHeader).toEqual(
            `${auth.expectedAuthType} ${auth.expectedToken}`,
          );
        });
      }

      describe('when oauth env vars are set', () => {
        it('THREATCODE_OAUTH_TOKEN should override config', async () => {
          env = {
            ...env,
            THREATCODE_OAUTH_TOKEN: 'snkyOAuthToken',
          };

          await runThreatcodeCLI(`-d`, { env });

          const authHeader = server.popRequest().headers?.authorization;
          expect(authHeader).toEqual(`Bearer ${env.THREATCODE_OAUTH_TOKEN}`);
        });

        it('THREATCODE_DOCKER_TOKEN should override config', async () => {
          env = {
            ...env,
            THREATCODE_DOCKER_TOKEN: 'threatcodeDockerToken',
          };

          await runThreatcodeCLI(`-d`, { env });

          const authHeader = server.popRequest().headers?.authorization;
          expect(authHeader).toEqual(`Bearer ${env.THREATCODE_DOCKER_TOKEN}`);
        });
      });

      describe('when token env vars are set', () => {
        it('THREATCODE_TOKEN should override config', async () => {
          env = {
            ...env,
            THREATCODE_TOKEN: 'threatcodeToken',
          };

          await runThreatcodeCLI(`-d`, { env });

          const authHeader = server.popRequest().headers?.authorization;
          expect(authHeader).toEqual(`token ${env.THREATCODE_TOKEN}`);
        });

        it('THREATCODE_CFG_API should override config', async () => {
          env = {
            ...env,
            THREATCODE_CFG_API: 'threatcodeCfgApiToken',
          };

          await runThreatcodeCLI(`-d`, { env });

          const authHeader = server.popRequest().headers?.authorization;
          expect(authHeader).toEqual(`token ${env.THREATCODE_CFG_API}`);
        });
      });
    });
  });
});
