import * as fs from 'fs';
import {
  getIntegrationEnvironment,
  getIntegrationEnvironmentVersion,
  getIntegrationName,
  getIntegrationVersion,
  INTEGRATION_ENVIRONMENT_ENVVAR,
  INTEGRATION_ENVIRONMENT_VERSION_ENVVAR,
  INTEGRATION_NAME_ENVVAR,
  INTEGRATION_VERSION_ENVVAR,
  isHomebrew,
  isScoop,
  validateHomebrew,
  validateScoopManifestFile,
} from '../../../src/lib/analytics/sources';

const emptyArgs = [];
const defaultArgsParams = {
  _: [],
  _doubleDashArgs: [],
};

beforeEach(() => {
  delete process.env[INTEGRATION_NAME_ENVVAR];
  delete process.env[INTEGRATION_VERSION_ENVVAR];
  delete process.env[INTEGRATION_ENVIRONMENT_ENVVAR];
  delete process.env[INTEGRATION_ENVIRONMENT_VERSION_ENVVAR];
});

describe('Scoop Detection', () => {
  it('detects if threatcode is installed via scoop', () => {
    const originalExecPath = process.execPath;
    process.execPath =
      process.cwd() + '/test/fixtures/scoop/good-manifest/threatcode-win.exe';
    expect(isScoop()).toBe(true);

    process.execPath = '/test/fixtures/scoop/bad-manifest/threatcode-win.exe';
    expect(isScoop()).toBe(false);
    process.execPath = originalExecPath;
  });

  it('validates scoop manifest file', () => {
    let threatcodeExecPath =
      process.cwd() + '/test/fixtures/scoop/good-manifest/threatcode-win.exe';
    expect(validateScoopManifestFile(threatcodeExecPath)).toBe(true);

    threatcodeExecPath =
      process.cwd() + '/test/fixtures/scoop/bad-manifest/threatcode-win.exe';
    expect(validateScoopManifestFile(threatcodeExecPath)).toBe(false);

    threatcodeExecPath = process.cwd() + '/test/fixtures/scoop/no-exist/threatcode-win.exe';
    expect(validateScoopManifestFile(threatcodeExecPath)).toBe(false);
  });
});

describe('Homebrew Detection', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('detects if threatcode is installed via Homebrew', () => {
    const originalExecPath = process.execPath;
    process.execPath = process.cwd() + '/usr/local/Cellar/threatcode/v1.413.2/bin';
    const fileExistsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    expect(isHomebrew()).toBe(true);
    expect(fileExistsSpy).toHaveBeenCalledTimes(1);
    process.execPath = originalExecPath;
  });

  it('returns false if formula not in Homebrew path', () => {
    const originalExecPath = process.execPath;
    process.execPath =
      process.cwd() + '/usr/local/some-other-location/threatcode/v1.413.2/bin';
    const fileExistsSpy = jest.spyOn(fs, 'existsSync');
    expect(isHomebrew()).toBe(false);
    expect(fileExistsSpy).not.toHaveBeenCalled();
    process.execPath = originalExecPath;
  });

  it('returns false if formula files does not exist', () => {
    const originalExecPath = process.execPath;
    process.execPath = process.cwd() + '/usr/local/Cellar/threatcode/v1.413.2/bin';
    const fileExistsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(isHomebrew()).toBe(false);
    expect(fileExistsSpy).toHaveBeenCalledTimes(1);
    process.execPath = originalExecPath;
  });

  it('validates Homebrew formula file exists', () => {
    let threatcodeExecPath =
      process.cwd() + '/test/fixtures/homebrew/Cellar/threatcode/vX/bin/threatcode'; // relies on fixture at /test/fixtures/homebrew/Cellar/vX/.brew/threatcode.rb
    expect(validateHomebrew(threatcodeExecPath)).toBe(true);

    threatcodeExecPath =
      process.cwd() +
      '/test/fixtures/homebrew/no-exist/Cellar/threatcode/vX/bin/threatcode';
    expect(validateHomebrew(threatcodeExecPath)).toBe(false);
  });
});

describe('getIntegrationName', () => {
  it('returns empty integration name by default', () => {
    expect(getIntegrationName(emptyArgs)).toBe('');
  });

  it('loads integration name from envvar', () => {
    process.env[INTEGRATION_NAME_ENVVAR] = 'JENKINS';
    expect(getIntegrationName(emptyArgs)).toBe('JENKINS');

    process.env[INTEGRATION_NAME_ENVVAR] = 'AZURE_PIPELINES';
    expect(getIntegrationName(emptyArgs)).toBe('AZURE_PIPELINES');
  });

  it('returns empty integration namewhen envvar is not recognized', () => {
    process.env[INTEGRATION_NAME_ENVVAR] = 'INVALID';
    expect(getIntegrationName(emptyArgs)).toBe('');
  });

  it('loads and formats integration name from CLI flag', () => {
    expect(
      getIntegrationName([
        { integrationName: 'homebrew', ...defaultArgsParams },
      ]),
    ).toBe('HOMEBREW');
  });

  it('loads and validates integration name from CLI flag', () => {
    expect(
      getIntegrationName([
        { integrationName: 'invalid', ...defaultArgsParams },
      ]),
    ).toBe('');
  });

  it('returns integration name SCOOP when threatcode is installed with scoop', () => {
    const originalExecPath = process.execPath;
    process.execPath =
      process.cwd() + '/test/fixtures/scoop/good-manifest/threatcode-win.exe';
    expect(getIntegrationName(emptyArgs)).toBe('SCOOP');
    process.execPath = originalExecPath;
  });

  it('returns integration name HOMEBREW when threatcode is installed with Homebrew', () => {
    const originalExecPath = process.execPath;
    process.execPath =
      process.cwd() + '/test/fixtures/homebrew/Cellar/threatcode/vX/bin/threatcode'; // relies on fixture at /test/fixtures/homebrew/Cellar/vX/.brew/threatcode.rb
    expect(getIntegrationName(emptyArgs)).toBe('HOMEBREW');
    process.execPath = originalExecPath;
  });
});

describe('getIntegrationVersion', () => {
  it('returns empty integration version by default', () => {
    expect(getIntegrationVersion(emptyArgs)).toBe('');
  });

  it('loads integration version from envvar', () => {
    process.env[INTEGRATION_VERSION_ENVVAR] = '1.2.3';
    expect(getIntegrationVersion(emptyArgs)).toBe('1.2.3');
  });

  it('loads integration version from CLI flag', () => {
    expect(
      getIntegrationVersion([
        { integrationVersion: '1.2.3-Crystal', ...defaultArgsParams },
      ]),
    ).toBe('1.2.3-Crystal');
  });
});

describe('getIntegrationEnvironment', () => {
  it('returns empty integration environment by default', () => {
    expect(getIntegrationEnvironment(emptyArgs)).toBe('');
  });

  it('loads integration environment from envvar', () => {
    process.env[INTEGRATION_ENVIRONMENT_ENVVAR] = 'WebStorm';
    expect(getIntegrationEnvironment(emptyArgs)).toBe('WebStorm');
  });

  it('loads integration environment from CLI flag', () => {
    expect(
      getIntegrationEnvironment([
        { integrationEnvironment: 'PhpStorm', ...defaultArgsParams },
      ]),
    ).toBe('PhpStorm');
  });
});

describe('getIntegrationEnvironmentVersion', () => {
  it('returns empty integration environment version by default', () => {
    expect(getIntegrationEnvironmentVersion(emptyArgs)).toBe('');
  });

  it('loads integration environment version from envvar', () => {
    process.env[INTEGRATION_ENVIRONMENT_VERSION_ENVVAR] = '2020.2';
    expect(getIntegrationEnvironmentVersion(emptyArgs)).toBe('2020.2');
  });

  it('loads integration environment version from CLI flag', () => {
    expect(
      getIntegrationEnvironmentVersion([
        { integrationEnvironmentVersion: '7.0.0', ...defaultArgsParams },
      ]),
    ).toBe('7.0.0');
  });
});
