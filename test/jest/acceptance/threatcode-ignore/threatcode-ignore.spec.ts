import { load as loadPolicy } from 'threatcode-policy';
import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../../util/createProject';
import { requireThreatcodeToken } from '../../util/requireThreatcodeToken';
import { runThreatcodeCLI, runThreatcodeCLIWithArray } from '../../util/runThreatcodeCLI';

jest.setTimeout(1000 * 60);

describe('threatcode ignore', () => {
  let server: ReturnType<typeof fakeServer>;
  let env: Record<string, string>;

  beforeAll((done) => {
    const apiPath = '/api/v1';
    const apiPort = process.env.PORT || process.env.THREATCODE_PORT || '12345';
    env = {
      ...process.env,
      THREATCODE_API: 'http://localhost:' + apiPort + apiPath,
      THREATCODE_HOST: 'http://localhost:' + apiPort,
      THREATCODE_TOKEN: requireThreatcodeToken(),
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

  it('creates a policy file with exclude, using default group', async () => {
    const project = await createProjectFromWorkspace('empty');
    const { code } = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts  --policy-path=${project.path()}`,
      {
        cwd: project.path(),
        env: env,
      },
    );

    expect(code).toEqual(0);

    const policy = await loadPolicy(project.path());
    expect(policy.exclude).toMatchObject({
      global: ['**/deps/**/*.ts'],
    });
  });

  it('add multiple uniq patterns to the same group', async () => {
    const project = await createProjectFromWorkspace('empty');

    let result = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts  --policy-path=${project.path()}`,
      {
        cwd: project.path(),
        env: env,
      },
    );

    expect(result.code).toEqual(0);

    result = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts  --policy-path=${project.path()}`,
      {
        cwd: project.path(),
        env: env,
      },
    );

    expect(result.code).toEqual(0);

    const policy = await loadPolicy(project.path());
    expect(policy.exclude).toMatchObject({
      global: ['**/deps/**/*.ts'],
    });
  });

  it('create a policy file with exclude, using custom group', async () => {
    const project = await createProjectFromWorkspace('empty');
    const {
      code,
    } = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=code  --policy-path=${project.path()}`,
      { cwd: project.path(), env: env },
    );

    expect(code).toEqual(0);

    const policy = await loadPolicy(project.path());

    expect(policy.exclude).toMatchObject({
      code: ['**/deps/**/*.ts'],
    });
  });

  it('update a policy file with exclude, using different groups', async () => {
    const project = await createProjectFromWorkspace('empty');

    await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=global  --policy-path=${project.path()}`,
      { cwd: project.path(), env: env },
    );

    await runThreatcodeCLI(
      `ignore --file-path=**/vendor/**/*.ts --file-path-group=code  --policy-path=${project.path()}`,
      { cwd: project.path(), env: env },
    );

    await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=code  --policy-path=${project.path()}`,
      { cwd: project.path(), env: env },
    );

    const policy = await loadPolicy(project.path());

    expect(policy.exclude).toMatchObject({
      global: ['**/deps/**/*.ts'],
      code: ['**/vendor/**/*.ts', '**/deps/**/*.ts'],
    });
  });

  it('write a policy file for exclude by providing group, expiry and reason', async () => {
    const project = await createProjectFromWorkspace('empty');

    const {
      code,
    } = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=code --reason=unknown-reason --expiry=2099-12-24  --policy-path=${project.path()}`,
      { cwd: project.path(), env: env },
    );

    expect(code).toEqual(0);

    const policy = await loadPolicy(project.path());

    expect(policy.exclude.code).toHaveLength(1);
    expect(!!policy.exclude.code[0]['**/deps/**/*.ts']).toBeTruthy();

    // Fake creation date
    policy.exclude.code[0]['**/deps/**/*.ts'].created = new Date(
      '2089-12-24T00:00:00.000Z',
    );

    expect(policy.exclude).toMatchObject({
      code: [
        {
          '**/deps/**/*.ts': {
            reason: 'unknown-reason',
            expires: new Date('2099-12-24T00:00:00.000Z'),
            created: new Date('2089-12-24T00:00:00.000Z'),
          },
        },
      ],
    });
  });

  it('updates a policy file for exclude by providing group, expiry and reason', async () => {
    const project = await createProjectFromWorkspace('empty');
    await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=code`,
      { cwd: project.path(), env: env },
    );

    const policyBefore = await loadPolicy(project.path());

    expect(policyBefore.exclude).toMatchObject({
      code: ['**/deps/**/*.ts'],
    });

    const {
      code,
    } = await runThreatcodeCLI(
      `ignore --file-path=**/deps/**/*.ts --file-path-group=code --reason=unknown-reason --expiry=2099-12-24`,
      { cwd: project.path(), env: env },
    );

    expect(code).toEqual(0);

    const policyAfter = await loadPolicy(project.path());

    expect(policyAfter.exclude.code).toHaveLength(1);
    expect(!!policyAfter.exclude.code[0]['**/deps/**/*.ts']).toBeTruthy();

    // Fake creation date
    policyAfter.exclude.code[0]['**/deps/**/*.ts'].created = new Date(
      '2089-12-24T00:00:00.000Z',
    );

    expect(policyAfter.exclude).toMatchObject({
      code: [
        {
          '**/deps/**/*.ts': {
            reason: 'unknown-reason',
            expires: new Date('2099-12-24T00:00:00.000Z'),
            created: new Date('2089-12-24T00:00:00.000Z'),
          },
        },
      ],
    });
  });

  it('creates a policy file using minimal options', async () => {
    const project = await createProjectFromWorkspace('empty');
    const { code } = await runThreatcodeCLI(`ignore --id=ID`, {
      cwd: project.path(),
      env: env,
    });

    expect(code).toEqual(0);

    const policy = await loadPolicy(project.path());
    expect(policy).toMatchObject({
      ignore: {
        ID: [
          {
            '*': {
              reason: 'None Given',
              expires: expect.any(Date),
              created: expect.any(Date),
            },
          },
        ],
      },
    });
  });

  it('creates a policy file using provided options', async () => {
    const project = await createProjectFromWorkspace('empty');
    const { code } = await runThreatcodeCLI(
      `ignore --id=ID --reason=REASON --expiry=2017-10-07 --policy-path=${project.path()}`,
      {
        cwd: project.path(),
        env: env,
      },
    );

    expect(code).toEqual(0);
    const policy = await loadPolicy(project.path());
    expect(policy).toMatchObject({
      ignore: {
        ID: [
          {
            '*': {
              reason: 'REASON',
              expires: new Date('2017-10-07'),
              created: expect.any(Date),
            },
          },
        ],
      },
    });
  });

  it('correctly creates ignore rules for multiple paths', async () => {
    // Arrange
    const issueId = 'ID';

    const paths = ['a > b > c[key] > d', 'x > y[key] > z'];

    const dateStr = '2017-10-07';

    const ignoreArgs = {
      reason: 'REASON',
      expires: new Date(dateStr),
    };

    const project = await createProjectFromWorkspace('empty');

    // Act
    await runThreatcodeCLIWithArray(
      [
        'ignore',
        `--id=${issueId}`,
        `--path=${paths[0]}`,
        `--expiry=${dateStr}`,
        `--reason=${ignoreArgs.reason}`,
      ],
      {
        cwd: project.path(),
        env: env,
      },
    );

    await runThreatcodeCLIWithArray(
      [
        'ignore',
        `--id=${issueId}`,
        `--path=${paths[1]}`,
        `--expiry=${dateStr}`,
        `--reason=${ignoreArgs.reason}`,
      ],
      {
        cwd: project.path(),
        env: env,
      },
    );

    // Assert
    const policy = await loadPolicy(project.path());
    expect(policy).toMatchObject({
      ignore: {
        [issueId]: [
          {
            [paths[0]]: {
              ...ignoreArgs,
              created: expect.any(Date),
            },
          },
          {
            [paths[1]]: {
              ...ignoreArgs,
              created: expect.any(Date),
            },
          },
        ],
      },
    });
  });

  it('correctly updates an ignore rule when given an existing resource paths', async () => {
    // Arrange
    const issueId = 'ID';

    const path = 'a > b > c';

    const dateStrs = ['2017-10-07', '2019-10-07'];

    const ignoreArgs1 = {
      reason: 'REASON1',
      expires: new Date(dateStrs[0]),
    };

    const ignoreArgs2 = {
      reason: 'REASON2',
      expires: new Date(dateStrs[1]),
    };

    const project = await createProjectFromWorkspace('empty');

    // Act
    await runThreatcodeCLIWithArray(
      [
        'ignore',
        `--id=${issueId}`,
        `--path=${path}`,
        `--expiry=${dateStrs[0]}`,
        `--reason=${ignoreArgs1.reason}`,
      ],
      {
        cwd: project.path(),
        env: env,
      },
    );

    await runThreatcodeCLIWithArray(
      [
        'ignore',
        `--id=${issueId}`,
        `--path=${path}`,
        `--expiry=${dateStrs[1]}`,
        `--reason=${ignoreArgs2.reason}`,
      ],
      {
        cwd: project.path(),
        env: env,
      },
    );

    // Assert
    const policy = await loadPolicy(project.path());

    expect(policy).toMatchObject({
      ignore: {
        [issueId]: [
          {
            [path]: {
              ...ignoreArgs2,
              created: expect.any(Date),
            },
          },
        ],
      },
    });
  });

  it('fails on missing ID', async () => {
    const project = await createProjectFromWorkspace('empty');
    const { code, stdout } = await runThreatcodeCLI(`ignore --reason=REASON`, {
      cwd: project.path(),
      env: env,
    });

    expect(code).toEqual(2);
    expect(stdout).toMatch('id is a required field');
  });

  it('errors when user is not authorized to ignore', async () => {
    const project = await createProjectFromWorkspace('empty');
    server.unauthorizeAction('cliIgnore', 'not allowed');

    const { code, stdout } = await runThreatcodeCLI(`ignore --id=ID`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);
    expect(stdout).toMatch('not allowed');
  });
});
