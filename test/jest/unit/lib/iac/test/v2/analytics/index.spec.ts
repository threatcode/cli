import * as clonedeep from 'lodash.clonedeep';
import * as path from 'path';
import * as analytics from '../../../../../../../../src/lib/analytics';
import * as fs from 'fs';

import { ThreatcodeIacTestOutput } from '../../../../../../../../src/lib/iac/test/v2/scan/results';
import {
  addIacAnalytics,
  IacAnalytics,
} from '../../../../../../../../src/lib/iac/test/v2/analytics';
import { TestConfig } from '../../../../../../../../src/lib/iac/test/v2/types';

jest.mock(
  '../../../../../../../../src/lib/iac/test/v2/local-cache/policy-engine/constants',
  () => ({
    ...jest.requireActual(
      '../../../../../../../../src/lib/iac/test/v2/local-cache/policy-engine/constants',
    ),
    policyEngineReleaseVersion: 'test-policy-engine-release-version',
  }),
);

describe('computeIacAnalytics', () => {
  const threatcodeIacTestOutputFixture: ThreatcodeIacTestOutput = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'threatcode-iac-test-results.json',
      ),
      'utf-8',
    ),
  );

  const iacAnalyticsFixture: IacAnalytics = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'fixtures', 'iac-analytics.json'),
      'utf-8',
    ),
  );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends the expected analytics', async () => {
    // Arrange
    const addedAnalytics: Record<string, any> = {};
    jest.spyOn(analytics, 'add').mockImplementation((key, value) => {
      addedAnalytics[key] = value;
    });

    const testConfig = {
      cloudContext: 'aws',
    } as TestConfig;
    const testOutput = clonedeep(threatcodeIacTestOutputFixture);
    const expectedAnalytics = clonedeep(iacAnalyticsFixture);

    // Act
    addIacAnalytics(testConfig, testOutput);

    // Assert
    expect(addedAnalytics).toStrictEqual(expectedAnalytics);
  });
});
